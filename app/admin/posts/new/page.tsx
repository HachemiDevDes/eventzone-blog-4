import PostEditor from '@/components/admin/PostEditor';

export default function NewPostPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-heading-lg text-text-primary">Nouvel article</h1>
        <p className="text-body-sm text-text-muted mt-1">Créez un nouveau article pour le blog Eventzone</p>
      </div>
      <PostEditor />
    </div>
  );
}
