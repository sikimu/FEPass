export function Badge({ children, color = 'blue', size = 'md' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${colors[color]} ${sizes[size]}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    not_started: { label: '未着手', color: 'gray' },
    studying: { label: '学習中', color: 'blue' },
    completed: { label: '完了', color: 'green' },
  };
  const { label, color } = map[status] || map.not_started;
  return <Badge color={color}>{label}</Badge>;
}
