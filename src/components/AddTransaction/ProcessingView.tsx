import React from 'react';
import '../../css/addTransactionModal.css';

export const ProcessingView: React.FC = () => (
  <div className="processingContainer animate-enter">
    <div className="spinner" />
    <h3 className="processingTitle">AI Analysis in Progress...</h3>
    <p className="processingText">Running OCR & extracting entities via Sonar</p>
  </div>
);
