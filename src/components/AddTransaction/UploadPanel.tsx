import React, { RefObject } from 'react';
import '../../css/addTransactionModal.css';

interface UploadPanelProps {
  fileInputRef: RefObject<HTMLInputElement>;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ fileInputRef }) => (
  <div className="uploadArea animate-enter" onClick={() => fileInputRef.current?.click()}>
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: 'none' }}
      accept=".pdf,.jpg,.png"
    />
    <div className="uploadIcon">📄</div>
    <div className="uploadTitle">Drop Statement or Click to Upload</div>
    <div className="uploadSubtitle">Supports PDF, JPG, PNG</div>
  </div>
);
