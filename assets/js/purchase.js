const deletePurchase =(btn)=>{
    const did = btn.parentNode.querySelector('[name=deleteId]').value;
    console.log("hello");
    const userElement = btn.closest('tr');

    fetch('/purchase-delete/'+ did,{
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