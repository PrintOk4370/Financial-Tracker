interface DashboardHeaderProps {
  userEmail: string;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userEmail, onSignOut }) => (
  <header className="dashboard-header">
    <div>
      <h1>Welcome, {userEmail}</h1>
      <p style={{ color: 'var(--text-muted)' }}>Your private financial dashboard</p>
    </div>
    <button onClick={onSignOut} className="btn-ghost">Sign Out</button>
  </header>
);

export default DashboardHeader;
