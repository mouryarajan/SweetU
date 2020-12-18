const deleteUser =(btn)=>{
    const did = btn.parentNode.querySelector('[name=deleteId]').value;

    const userElement = btn.closest('tr');

    fetch('/user-delete/'+ did,{
        method: 'DELETE',
    }).then(result => {
        return result.json();
    })
    .then(data=>{
        console.log(data);
        userElement.parentNode.removeChild(userElement);
    })
    .catch(err=>{
        console.log(err);
    });
};