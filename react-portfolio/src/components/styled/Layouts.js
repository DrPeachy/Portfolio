import styled from 'styled-components';

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

export const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;