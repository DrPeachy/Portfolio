// src/components/PulsingOutline.js
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outline } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';

/**
 * 一个自带呼吸脉冲效果的 Outline 组件
 * 注意：必须放在 <EffectComposer> 内部使用
 * 且 EffectComposer 需设置 disableNormalPass={false} 和 multisampling={0}
 */
const PulsingOutline = ({
  // 可配置参数及其默认值
  visibleEdgeColor = '#00ffff', // 可见边缘颜色 (默认青色)
  hiddenEdgeColor = '#ff00ff',  // 遮挡边缘颜色 (默认洋红)
  pulseSpeed = 3,               // 呼吸速度
  edgeStrengthBase = 12,         // 基础强度
  edgeStrengthRange = 8,        // 呼吸波动范围 (强度会在 Base ± Range 之间跳动)
  width = 400,                   // 描边宽度
  blur = true,                  // 是否模糊
  kernelSize = KernelSize.LARGE, // 模糊质量
  ...props                      // 允许传入其他 Outline 的原生 props
}) => {
  const outlineRef = useRef();

  useFrame((state) => {
    if (outlineRef.current) {
      const t = state.clock.getElapsedTime();
      // 核心动画逻辑：正弦波呼吸
      outlineRef.current.edgeStrength = Math.sin(t * pulseSpeed) * edgeStrengthRange + edgeStrengthBase;
    }
  });

  return (
    <Outline
      
      ref={outlineRef}
      blur={blur}
      kernelSize={kernelSize}
      width={width}
      visibleEdgeColor={visibleEdgeColor}
      hiddenEdgeColor={hiddenEdgeColor}
      // 强制使用滤色模式来实现发光效果 (如果你想画黑线，传 blendFunction={BlendFunction.NORMAL} 覆盖即可)
      blendFunction={BlendFunction.SCREEN} 
      {...props}
    />
  );
};

export default PulsingOutline;