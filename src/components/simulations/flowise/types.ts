export type FlowiseStep =
  | 'idle'
  | 'question'
  | 'flowing'
  | 'retrieving'
  | 'answering'
  | 'done'

export type FlowNodeId =
  | 'input'
  | 'loader'
  | 'embeddings'
  | 'vector'
  | 'chain'
  | 'output'

export type DemoScene = {
  question: string
  time: string
  answer: string
  sources: string[]
  tokens: number
  latencyMs: number
}
