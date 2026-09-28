import { useCallback, useEffect, useRef, useState } from 'react'

export type AmbientSoundState = 'off' | 'on' | 'paused' | 'unavailable'

type AmbientGraph = {
  context: AudioContext
  source: AudioBufferSourceNode
  master: GainNode
  motion: OscillatorNode
}

function seededNoise(length: number) {
  const samples = new Float32Array(length)
  let seed = 0x4d425544
  let brown = 0

  for (let index = 0; index < length; index += 1) {
    seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
    const white = (seed / 0x1_0000_0000) * 2 - 1
    brown = (brown + white * 0.018) / 1.018
    samples[index] = Math.max(-1, Math.min(1, brown * 3.1))
  }

  return samples
}

function createAmbientGraph() {
  if (typeof AudioContext === 'undefined') {
    return null
  }

  const context = new AudioContext()
  const durationSeconds = 6
  const buffer = context.createBuffer(
    1,
    context.sampleRate * durationSeconds,
    context.sampleRate,
  )
  buffer.copyToChannel(seededNoise(buffer.length), 0)

  const source = context.createBufferSource()
  source.buffer = buffer
  source.loop = true

  const highPass = context.createBiquadFilter()
  highPass.type = 'highpass'
  highPass.frequency.value = 70
  highPass.Q.value = 0.25

  const lowPass = context.createBiquadFilter()
  lowPass.type = 'lowpass'
  lowPass.frequency.value = 760
  lowPass.Q.value = 0.4

  const textureGain = context.createGain()
  textureGain.gain.value = 0.34

  const master = context.createGain()
  master.gain.value = 0.0001

  const motion = context.createOscillator()
  motion.type = 'sine'
  motion.frequency.value = 0.075

  const motionDepth = context.createGain()
  motionDepth.gain.value = 0.018

  source.connect(highPass)
  highPass.connect(lowPass)
  lowPass.connect(textureGain)
  textureGain.connect(master)
  master.connect(context.destination)

  motion.connect(motionDepth)
  motionDepth.connect(textureGain.gain)

  source.start()
  motion.start()

  return {
    context,
    source,
    master,
    motion,
  } satisfies AmbientGraph
}

function rampMaster(graph: AmbientGraph, enabled: boolean) {
  const now = graph.context.currentTime
  const gain = graph.master.gain

  gain.cancelScheduledValues(now)
  gain.setValueAtTime(Math.max(gain.value, 0.0001), now)

  if (enabled) {
    gain.exponentialRampToValueAtTime(0.036, now + 0.32)
  } else {
    gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
  }
}

export function ambientSoundPressed(state: AmbientSoundState) {
  return state === 'on' || state === 'paused'
}

export function ambientSoundLabel(state: AmbientSoundState) {
  switch (state) {
    case 'on':
      return 'Sound on'
    case 'paused':
      return 'Sound paused'
    case 'unavailable':
      return 'Sound unavailable'
    default:
      return 'Sound off'
  }
}

export function useAmbientSound() {
  const [state, setState] = useState<AmbientSoundState>('off')
  const graphRef = useRef<AmbientGraph | null>(null)
  const enabledRef = useRef(false)
  const suspendTimerRef = useRef<number | null>(null)

  const clearSuspendTimer = useCallback(() => {
    if (suspendTimerRef.current !== null) {
      window.clearTimeout(suspendTimerRef.current)
      suspendTimerRef.current = null
    }
  }, [])

  const ensureGraph = useCallback(() => {
    if (graphRef.current) {
      return graphRef.current
    }

    const graph = createAmbientGraph()
    graphRef.current = graph
    return graph
  }, [])

  const enable = useCallback(async () => {
    clearSuspendTimer()

    const graph = ensureGraph()
    if (!graph) {
      enabledRef.current = false
      setState('unavailable')
      return
    }

    enabledRef.current = true

    try {
      await graph.context.resume()
      rampMaster(graph, true)
      setState(document.hidden ? 'paused' : 'on')

      if (document.hidden) {
        await graph.context.suspend()
      }
    } catch {
      enabledRef.current = false
      setState('unavailable')
    }
  }, [clearSuspendTimer, ensureGraph])

  const disable = useCallback(() => {
    clearSuspendTimer()
    enabledRef.current = false

    const graph = graphRef.current
    if (!graph) {
      setState('off')
      return
    }

    rampMaster(graph, false)
    setState('off')

    suspendTimerRef.current = window.setTimeout(() => {
      suspendTimerRef.current = null
      void graph.context.suspend()
    }, 190)
  }, [clearSuspendTimer])

  const toggle = useCallback(() => {
    if (enabledRef.current) {
      disable()
      return
    }

    void enable()
  }, [disable, enable])

  useEffect(() => {
    const handleVisibility = () => {
      const graph = graphRef.current
      if (!graph || !enabledRef.current) {
        return
      }

      clearSuspendTimer()

      if (document.hidden) {
        rampMaster(graph, false)
        setState('paused')
        void graph.context.suspend()
        return
      }

      void graph.context
        .resume()
        .then(() => {
          if (!enabledRef.current) {
            return
          }

          rampMaster(graph, true)
          setState('on')
        })
        .catch(() => {
          enabledRef.current = false
          setState('unavailable')
        })
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [clearSuspendTimer])

  useEffect(() => {
    return () => {
      clearSuspendTimer()
      const graph = graphRef.current
      graphRef.current = null

      if (graph) {
        graph.source.stop()
        graph.motion.stop()
        void graph.context.close()
      }
    }
  }, [clearSuspendTimer])

  return {
    state,
    pressed: ambientSoundPressed(state),
    label: ambientSoundLabel(state),
    toggle,
  }
}
