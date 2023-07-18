import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const deleteConfirmation = ({title, text, confirmButtonText, onDelete}) => {
    MySwal.fire({
        //title: title || 'Are you sure?',
        text: text || "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4F46E5',
        cancelButtonText: 'CANCELAR',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText || 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Eliminado!','Tu registro fue eliminado.','success');
          if(onDelete) {
            onDelete();
          }
        }
      })
}

export default deleteConfirmation;