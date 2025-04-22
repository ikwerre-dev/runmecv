interface JobStatus {
  id: string;
  stages: {
    scraping: { completed: boolean; error: string | null };
    resumeGeneration: { completed: boolean; error: string | null };
    pdfGeneration: { completed: boolean; error: string | null };
  };
  result?: any;
}

const jobs = new Map<string, JobStatus>();

export function createJob(): string {
  const id = Math.random().toString(36).substring(2, 15);
  jobs.set(id, {
    id,
    stages: {
      scraping: { completed: false, error: null },
      resumeGeneration: { completed: false, error: null },
      pdfGeneration: { completed: false, error: null }
    }
  });
  return id;
}

export function updateJobStatus(id: string, updates: Partial<JobStatus>): void {
  const job = jobs.get(id);
  if (job) {
    jobs.set(id, { ...job, ...updates });
  }
}

export function getJobStatus(id: string): JobStatus | null {
  return jobs.get(id) || null;
}