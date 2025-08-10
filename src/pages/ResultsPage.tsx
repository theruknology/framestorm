import React, { useEffect } from "react";

// Simple confetti animation using canvas
function Confetti() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const confettiCount = 150;
    const confetti = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
    }));
    let animationFrameId;
    let stop = false;
    function draw() {
      if (stop) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((c, i) => {
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
        ctx.stroke();
      });
      update();
      animationFrameId = requestAnimationFrame(draw);
    }
    function update() {
      confetti.forEach((c, i) => {
        c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
        c.x += Math.sin(0.01 * c.d);
        c.tiltAngle += c.tiltAngleIncremental;
        c.tilt = Math.sin(c.tiltAngle - i) * 15;
        if (c.y > canvas.height) {
          c.x = Math.random() * canvas.width;
          c.y = -10;
        }
      });
    }
    draw();
    const timeout = setTimeout(() => {
      stop = true;
      cancelAnimationFrame(animationFrameId);
      document.body.removeChild(canvas);
    }, 2000);
    return () => {
      stop = true;
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
      if (document.body.contains(canvas)) document.body.removeChild(canvas);
    };
  }, []);
  return null;
}

export default function ResultsPage() {
  useEffect(() => {
    // Confetti will mount on page load
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-12 px-4 relative">
      <Confetti />
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-700 drop-shadow-lg">
        Your Video is Ready!
      </h1>
      <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center">
        <video
          controls
          className="w-[360px] h-[640px] rounded-lg shadow-lg border-2 border-indigo-200 object-cover bg-black"
          style={{ aspectRatio: "9/16" }}
        >
          <source src="/media/example_folder/reel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
