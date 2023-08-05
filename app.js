import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, updateDoc, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3ZvtJgykA5zlFpKuhnsSq_Ay6HKZlNec",
    authDomain: "task-e2185.firebaseapp.com",
    projectId: "task-e2185",
    storageBucket: "task-e2185.appspot.com",
    messagingSenderId: "447773639548",
    appId: "1:447773639548:web:c917761b6d901682781af9",
    measurementId: "G-0D3K0WGC3G"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

document.getElementById('btn').addEventListener('click', async () => {

    let file = document.getElementById("file").files[0];
    let title = document.getElementById("title").value;
    let description = document.getElementById("des").value;
    if (file.length == 0 && title == "" && description == "") {
        Swal.fire({
            title: `Filled Input First`,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }else{
        try {

            const docRef = await addDoc(collection(db, 'Post App'), {
                Title: title,
                Description: description,
            });

            console.log("Document written with ID: ", docRef.id);

        } catch (e) {
            console.error("Error adding document: ", e);
        }
        const storageRef = ref(storage, `${title}`);
        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        })
        .then(()=>{
            window.location.reload()
        })
    }
})

const querySnapshot = await getDocs(collection(db, "Post App"));
querySnapshot.forEach((doc) => {

 
    getDownloadURL(ref(storage, `${doc.data().Title}`))
    .then((url) => {
     
 console.log(url,"pic");

    
    
        document.getElementById('show').innerHTML +=
                `<div id="set"><img alt="Image" src="${url}" id="imgs">
                <h2>${(doc.data().Title)}</h2>
                <h4>${(doc.data().Description)}</h4>
                <button class="upd" onclick="edit('${doc.id}')"><i class = "fa-solid fa-pen-to-square"></i></button>
                <button class="del" onclick="del('${doc.id}')"><i class = "fa-solid fa-trash"></i></button></div>`
            })
                .catch((error) => {
                    console.log("Error",error)
                });
    console.log(doc.data(), "data");
    console.log(doc.id, "id");
    console.log(doc, "doc");
});

const edit = async (id) => {

    console.log(id);
    Swal.fire({
        title: 'Enter Updated Title',
        input: 'text',
        confirmButtonText: 'Confirm',
    }).then(async (result) => {
        if (result.isConfirmed) {
            const editText = doc(db, "Post App", id);
            await updateDoc(editText, {
                Title: result.value,
            }).then(() => {
                location.reload();
            })
        }
        Swal.fire({
            title: 'Enter Updated Description',
            input: 'text',
            confirmButtonText: 'Confirm',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const editText = doc(db, "Post App", id);
                await updateDoc(editText, {
                    Description: result.value,
                })
                Swal.fire({
                    title: `Edit Successfully`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    location.reload();
                })
            }
        })
    });
}

window.edit = edit;

const del = async (id) => {
    await deleteDoc(doc(db, "Post App", id))
        .then(() => {
            Swal.fire({
                title: `Delete Successfully`,
                icon: 'success',
                confirmButtonText: 'OK'
            })
            function time() {
                location.reload()
            }
            setInterval(time, 3000);
        });
}
window.del = del;

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         const uid = user.uid;
//         console.log("UID: ", uid);
//     }
//     else {
//         Swal.fire({
//             title: `Account`,
//             text: `First Create An Account`,
//             icon: 'error',
//             confirmButtonText: 'OK'
//         });
//         function wrong() {
//             window.location.href = "./index.html"
//         }
//         setInterval(wrong, 3000);
//     }
// });