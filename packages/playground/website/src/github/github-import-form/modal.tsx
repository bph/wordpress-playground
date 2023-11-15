import { signal } from '@preact/signals-react';
import { usePlaygroundContext } from '../../components/playground-viewport/context';
import Modal, { defaultStyles } from '../../components/modal';
import GitHubForm from './form';
import { GitHubPointer } from '../analyze-github-url';

const query = new URLSearchParams(window.location.search);
export const isGitHubModalOpen = signal(query.get('state') === 'github-import');

interface GithubImportModalProps {
	onImported?: (pointer: GitHubPointer) => void;
}
export function closeModal() {
	isGitHubModalOpen.value = false;
	// Remove ?state=github-import from the URL.
	const url = new URL(window.location.href);
	url.searchParams.delete('state');
	window.history.replaceState({}, '', url.href);
}
export function openModal() {
	isGitHubModalOpen.value = true;
	// Add a ?state=github-import to the URL so that the user can refresh the page
	// and still see the modal.
	const url = new URL(window.location.href);
	url.searchParams.set('state', 'github-import');
	window.history.replaceState({}, '', url.href);
}
export function GithubImportModal({ onImported }: GithubImportModalProps) {
	const { playground } = usePlaygroundContext();
	return (
		<Modal
			style={{
				...defaultStyles,
				content: { ...defaultStyles.content, width: 600 },
			}}
			isOpen={isGitHubModalOpen.value}
			onRequestClose={closeModal}
		>
			<GitHubForm
				playground={playground!}
				onClose={closeModal}
				onImported={(pointer) => {
					playground!.goTo('/');
					// eslint-disable-next-line no-alert
					alert(
						'Import finished! Your Playground site has been updated.'
					);
					closeModal();
					onImported?.(pointer);
				}}
			/>
		</Modal>
	);
}