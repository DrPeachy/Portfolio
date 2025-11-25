import styled from 'styled-components';

// 注意这里要加 export，这样别的组件才能引用
export const GridContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  padding: 5rem 10%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

// 你甚至可以顺便把 Container 也写在这里替代 Bootstrap 的 Container
export const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;