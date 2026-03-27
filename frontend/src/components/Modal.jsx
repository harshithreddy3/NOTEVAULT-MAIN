import Modal from 'react-modal';
import { darkThemeAtom } from '../recoil/atoms/darkThemeAtom';
import { useRecoilValue } from 'recoil';

function Model({ children, modalIsOpen, closeModal }) {
    const darkTheme = useRecoilValue(darkThemeAtom);
    Modal.setAppElement('#root');
    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Delete Confirmation"
                className={`${darkTheme ? 'bg-[#202020] text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg sm:w-[30rem] `}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
                {children}
            </Modal>
        </div>
    );
}

export default Model;