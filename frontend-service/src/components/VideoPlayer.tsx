import { useRef, useEffect } from "react";

const VideoPlayer = ({ videoId }: { videoId: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const elem = videoRef.current;
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    if (elem) {
      elem.addEventListener("contextmenu", handleContextMenu);
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        controls
        controlsList="nodownload"
        style={{ width: "50%", height: "auto" }}
      >
        <source
          src={`${process.env.REACT_APP_GATEWAY}/api/v1/video/${videoId}`}
          type="video/mp4"
        />
        Your browser does not support the video tag
      </video>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "50%",
          backgroundColor: "transparent",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
