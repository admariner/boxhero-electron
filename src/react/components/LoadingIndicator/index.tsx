import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { getMainView } from '../../fromElectron';
import Spinner from './Spinner';

interface LoadingContainerProps {
  isLoading: boolean;
}

const LoadingContainer = styled.div<LoadingContainerProps>`
  display: ${({ isLoading = false }) => (isLoading ? 'flex' : 'none')};

  position: fixed;
  left: 50%;
  top: 50%;

  align-items: center;
  justify-content: center;

  padding: 40px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 15%;

  transform: translate(-50%, -50%);

  z-index: 9999;
`;

const LoadingIndicator: React.FC = () => {
  const isOpened = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const webview = getMainView();
    if (!webview || isOpened.current) return;

    const setLoadingTrue = () => setIsLoading(true);
    const setLoadingFalse = () => {
      isOpened.current = true;
      setIsLoading(false);
    };

    webview.addEventListener('did-start-loading', setLoadingTrue);
    webview.addEventListener('did-stop-loading', setLoadingFalse);
    webview.addEventListener('dom-ready', () => setLoadingFalse);

    return () => {
      webview.removeEventListener('did-start-loading', setLoadingTrue);
      webview.removeEventListener('did-stop-loading', setLoadingFalse);
      webview.removeEventListener('dom-ready', setLoadingFalse);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened.current]);

  return (
    <LoadingContainer isLoading={isLoading}>
      <Spinner />
    </LoadingContainer>
  );
};

export default LoadingIndicator;
