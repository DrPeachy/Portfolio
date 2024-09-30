import React from 'react';

function MaskedSvgButton() {
  const handleClick = () => {
    console.log('Circle clicked');
    // 这里可以添加你需要的逻辑，例如导航或状态更新
  };

  return (
    <svg width="200" height="200">
      <defs>
        <mask id="circleMask">
          <rect width="100%" height="100%" fill="white" />
          <circle cx="100" cy="100" r="50" fill="black" />
        </mask>
      </defs>

      {/* 背景矩形，应用 mask */}
      <rect width="200" height="200" fill="gray" mask="url(#circleMask)" />

      {/* 在 mask 可见区域下的 circle */}
      <circle
        cx="100"
        cy="100"
        r="50"
        fill="#ff6347"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
    </svg>
  );
}

export default MaskedSvgButton;
