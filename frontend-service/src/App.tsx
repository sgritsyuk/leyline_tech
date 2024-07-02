import React from 'react';
import ImageUpload from "./components/ImageUpload";
import TaskProgress from "./components/TaskProgress";
import './App.css';

function App() {
  const [taskId, setTaskId] = React.useState<string | null>(null);

  return (
    <div className="App">
      {taskId ?
        <TaskProgress taskId={taskId} /> :
        <ImageUpload setTaskId={setTaskId}/>
      }
    </div>
  );
}

export default App;
