import showModal from './modal';
import { createFighterPreview } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    // call showModal function
    showModal({
        title: 'Congratulations! You won!',
        bodyElement: createFighterPreview(fighter),
        onClose: () => window.location.reload()
    });
}
