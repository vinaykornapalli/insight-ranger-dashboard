
export interface ChunkDocument {
  _id: string;
  _index: string;
  _score: number;
  _source: ChunkSource;
}

export interface ChunkSource {
  question: string;
  parser_type: string;
  answer: string;
  doc_type: string;
  page_numbers: number[];
  text: string;
  query_question: string;
  doc_name: string;
  pg_num: number;
  paragraph_id: string;
  document_source: string;
  eval_metrics: QualityMetrics;
  substantive: number;
  cohesive: number;
  last_eval_time: string;
}

export interface QualityMetrics {
  complete_reason: string;
  noise_reason: string;
  context_reason: string;
  substantive_reason: string;
  coherent_reason: string;
  cohesion_score: number;
  low_noise_score: number;
  completeness_score: number;
  substantiveness_score: number;
  contextual_sufficiency_score: number;
}

export interface BotMetrics {
  botId: string;
  totalChunks: number;
  avgSubstantive: number;
  avgCohesive: number;
  avgCompleteness: number;
  avgLowNoise: number;
  avgContextualSufficiency: number;
  scoresDistribution: ScoreDistribution;
}

export interface ScoreDistribution {
  cohesion: number[];
  lowNoise: number[];
  completeness: number[];
  substantiveness: number[];
  contextualSufficiency: number[];
}

export interface ChunkMetric {
  metricName: string;
  score: number;
  maxScore: number;
  reason: string;
  colorClass: string;
}

export interface InsightItem {
  type: 'warning' | 'success' | 'info';
  metric: string;
  message: string;
  affectedChunks: number;
  recommendation: string;
}

export interface ApiFilters {
  botId: string;
  searchQuery?: string;
  metricThreshold?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
