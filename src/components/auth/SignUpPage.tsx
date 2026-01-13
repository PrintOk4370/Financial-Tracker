import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

type View = 'landing' | 'signup' | 'login' | 'dashboard';

interface NavigationProps {
  onNavigate: (view: View) => void;
}

const SignUpPage: React.FC<NavigationProps> = ({ onNavigate }) => {
  return (
    <div className="animate-enter" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', paddingTop: '100px' }}>
      {/* 
          The Authenticator handles the "Construct Identity" phase.
          All subscription/transaction logic has been removed as it 
          is now handled by your AddTransactionModal.
      */}
      <Authenticator initialState="signUp">
        {({ user }) => (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ marginBottom: '20px' }}>Identity Verified</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
              Welcome, <span className="mono" style={{ color: 'var(--primary-teal)' }}>{user?.signInDetails?.loginId}</span>. 
              Your secure environment is ready.
            </p>
            
            <button 
              className="btn-primary" 
              style={{ width: '100%' }} 
              onClick={() => onNavigate('dashboard')}
            >
              Enter Dashboard
            </button>
          </div>
        )}
      </Authenticator>
    </div>
  );
};

export default SignUpPage;
