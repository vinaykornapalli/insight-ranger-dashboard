
import { BotMetrics, ChunkDocument, InsightItem, ApiFilters } from "@/types";

// Mock data for demonstration purposes
// In a real implementation, these would be actual API calls to your Elasticsearch proxy
export const fetchBots = async (): Promise<string[]> => {
  // Simulating API call
  return await Promise.resolve(['bot1', 'bot2', 'bot3', 'bot4']);
};

export const fetchBotMetrics = async (botId: string): Promise<BotMetrics> => {
  // Simulating API call to get aggregated metrics for a specific bot
  return await Promise.resolve({
    botId,
    totalChunks: 1254,
    avgSubstantive: 0.78,
    avgCohesive: 0.72,
    avgCompleteness: 0.81,
    avgLowNoise: 0.85,
    avgContextualSufficiency: 0.76,
    scoresDistribution: {
      cohesion: [32, 67, 120, 210, 305, 240, 160, 80, 35, 5],
      lowNoise: [15, 40, 85, 150, 250, 320, 230, 110, 44, 10],
      completeness: [25, 55, 95, 170, 280, 300, 200, 90, 30, 9],
      substantiveness: [18, 45, 90, 160, 275, 315, 220, 100, 25, 6],
      contextualSufficiency: [22, 50, 105, 190, 290, 280, 190, 95, 27, 5]
    }
  });
};

export const fetchChunks = async (filters: ApiFilters): Promise<ChunkDocument[]> => {
  // Sample chunk based on the provided example
  const sampleChunk: ChunkDocument = {
    _id: "8slsaZYBwUk7OXhO2LW2",
    _index: "documents_v2_x1695206105900_gpt",
    _score: 1.0,
    _source: {
      question: "KBID – 14  \n  \nExcel Crash Issue When Saving/Browsing Files Issue Description User is unable to save or browse files. The application will crash or shut down.  Affected Platforms · Excel · Word · PowerPoint  Instructions  1. Launch Excel 2. Click File-->Account 3. On top left-hand corner under User Information, Click Sign Out. 4. Close Excel application. 5. On the bottom left-hand corner of your screen, click on the Windows Icon. 6. Type Run, Hit Enter, type regedit, click OK and say Yes to pop-up.",
      parser_type: "pypdf_loader",
      answer: "KBID – 14  \n  \nExcel Crash Issue When Saving/Browsing Files Issue Description User is unable to save or browse files. The application will crash or shut down.  Affected Platforms · Excel · Word · PowerPoint  Instructions  1. Launch Excel 2. Click File-->Account 3. On top left-hand corner under User Information, Click Sign Out. 4. Close Excel application. 5. On the bottom left-hand corner of your screen, click on the Windows Icon. 6. Type Run, Hit Enter, type regedit, click OK and say Yes to pop-up.",
      doc_type: "answers",
      page_numbers: [1],
      text: "KBID – 14  \n  \nExcel Crash Issue When Saving/Browsing Files Issue Description User is unable to save or browse files. The application will crash or shut down.  Affected Platforms · Excel · Word · PowerPoint  Instructions  1. Launch Excel 2. Click File-->Account 3. On top left-hand corner under User Information, Click Sign Out. 4. Close Excel application. 5. On the bottom left-hand corner of your screen, click on the Windows Icon. 6. Type Run, Hit Enter, type regedit, click OK and say Yes to pop-up.",
      query_question: "KBID – 14  \n  \nExcel Crash Issue When Saving/Browsing Files Issue Description User is unable to save or browse files. The application will crash or shut down.  Affected Platforms · Excel · Word · PowerPoint  Instructions  1. Launch Excel 2. Click File-->Account 3. On top left-hand corner under User Information, Click Sign Out. 4. Close Excel application. 5. On the bottom left-hand corner of your screen, click on the Windows Icon. 6. Type Run, Hit Enter, type regedit, click OK and say Yes to pop-up.",
      doc_name: "KBID_14_-_ExcelCrashKB.pdf",
      pg_num: 1,
      paragraph_id: "0b8f91504d2fc0c30971745525462103",
      document_source: "yellowmessenger",
      eval_metrics: {
        complete_reason: "While the chunk provides a series of steps, it does not conclude with a final action or result after the registry edit, leaving the process feeling slightly incomplete.",
        noise_reason: "The chunk is focused on relevant troubleshooting information with minimal extraneous content. There are no distracting elements or irrelevant information present.",
        context_reason: "The chunk is mostly understandable on its own, with clear headings and a structured format. However, some terms like 'regedit' may require prior knowledge for full clarity.",
        substantive_reason: "The chunk provides specific, actionable instructions for troubleshooting the Excel crash issue, detailing the steps to sign out and access the registry editor, which are relevant to the problem described.",
        cohesion_score: 9,
        low_noise_score: 9,
        completeness_score: 7,
        substantiveness_score: 8,
        coherent_reason: "The instructions follow a logical sequence, making it easy to understand the steps needed to address the issue. Each step builds on the previous one, maintaining a clear focus on resolving the crash.",
        contextual_sufficiency_score: 8
      },
      substantive: 0.85,
      cohesive: 0.72,
      last_eval_time: "2025-05-01T21:42:14.121Z"
    }
  };

  // Generate some varied mock data based on our sample
  const chunks: ChunkDocument[] = Array.from({ length: 20 }, (_, i) => {
    const id = `chunk_${i + 1}`;
    const scoreVariation = Math.random() * 0.3 - 0.15; // Random variation between -0.15 and 0.15
    
    return {
      ...sampleChunk,
      _id: id,
      _source: {
        ...sampleChunk._source,
        doc_name: `Document_${Math.floor(i / 3) + 1}.pdf`,
        paragraph_id: `paragraph_${i + 1}`,
        eval_metrics: {
          ...sampleChunk._source.eval_metrics,
          cohesion_score: Math.max(1, Math.min(10, Math.floor(sampleChunk._source.eval_metrics.cohesion_score + (Math.random() * 4 - 2)))),
          low_noise_score: Math.max(1, Math.min(10, Math.floor(sampleChunk._source.eval_metrics.low_noise_score + (Math.random() * 4 - 2)))),
          completeness_score: Math.max(1, Math.min(10, Math.floor(sampleChunk._source.eval_metrics.completeness_score + (Math.random() * 4 - 2)))),
          substantiveness_score: Math.max(1, Math.min(10, Math.floor(sampleChunk._source.eval_metrics.substantiveness_score + (Math.random() * 4 - 2)))),
          contextual_sufficiency_score: Math.max(1, Math.min(10, Math.floor(sampleChunk._source.eval_metrics.contextual_sufficiency_score + (Math.random() * 4 - 2)))),
        },
        substantive: Math.max(0, Math.min(1, sampleChunk._source.substantive + scoreVariation)),
        cohesive: Math.max(0, Math.min(1, sampleChunk._source.cohesive + scoreVariation)),
      }
    };
  });

  return await Promise.resolve(chunks);
};

export const fetchInsights = async (botId: string): Promise<InsightItem[]> => {
  // Generate insights based on common RAG issues
  return await Promise.resolve([
    {
      type: 'warning',
      metric: 'Completeness',
      message: 'Several chunks have incomplete information',
      affectedChunks: 42,
      recommendation: 'Review chunks with completeness scores below 7 and consider expanding the content or merging with related chunks.'
    },
    {
      type: 'success',
      metric: 'Low Noise',
      message: 'Most chunks have minimal noise',
      affectedChunks: 1054,
      recommendation: 'Maintain current chunking strategy for noise control.'
    },
    {
      type: 'info',
      metric: 'Contextual Sufficiency',
      message: 'Some chunks lack sufficient context',
      affectedChunks: 78,
      recommendation: 'Consider adjusting chunk size or including more contextual information for self-contained understanding.'
    },
    {
      type: 'warning',
      metric: 'Substantiveness',
      message: 'Several chunks contain low information density',
      affectedChunks: 63,
      recommendation: 'Review chunks with substantiveness scores below 6 to ensure they contribute meaningful information.'
    }
  ]);
};
