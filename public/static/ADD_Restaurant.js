const addData = []

const addMenu = async(v) => {
     await store.state.restCollection.add(v)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.error(err,"err");
        });
};

const addToDB = () => {
    addData.forEach(v => {
        addMenu(v);
    })
};


addToDB();