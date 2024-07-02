import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";

interface GenerationProgressProps {
  taskId: string;
}

interface TaskResponse {
  status: string;
  progress: number;
  filename: string;
  message?: string;
}

const fetchTask = async (taskId: string): Promise<TaskResponse> => {
  const { data } = await axios.get(`${process.env.REACT_APP_GATEWAY}/api/v1/task/${taskId}`);
  return data;
};

const useProgress = (taskId: string) => {
  const [taskResponse, setTaskResponse] = useState<TaskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetchTask(taskId);
        setTaskResponse(resp);
        setIsLoading(false);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // every 3 sec

    return () => clearInterval(interval);
  }, [taskId]);

  return { taskResponse, isLoading, error };
};

const ProgressBar: React.FC<GenerationProgressProps> = ({ taskId }) => {
  const { taskResponse, isLoading, error } = useProgress(taskId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error has occurred: {error.message}</p>;

  const status = taskResponse?.status || 'N/A';
  const progress = taskResponse?.progress || 0;

  if (status === 'FAILED') {
    return (
      <div>
        Error occurred 
      </div>
    );
  }

  return (
    <div>
      <div>Status: {status} ({progress}%)</div>
      <progress value={progress} max="100" />
      {status === 'FINISHED' && taskId ? <VideoPlayer videoId={taskId} /> : null}
    </div>
  );
};

export default ProgressBar;
