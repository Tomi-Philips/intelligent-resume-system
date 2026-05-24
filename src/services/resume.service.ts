export const resumeService = {
  async uploadResumes(jobId: string, files: File[]): Promise<{ success: boolean; count: number }> {
    let successCount = 0;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobId', jobId);

        const response = await fetch('/api/resumes/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }

        successCount++;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
      }
    }
    
    return { 
      success: successCount > 0, 
      count: successCount 
    };
  }
};
