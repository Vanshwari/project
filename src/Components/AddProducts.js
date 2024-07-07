import React, { useState } from 'react';
import { storage, db } from '../Config/Config';
import { addDoc, collection, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export const AddProducts = () => {

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productImg, setProductImg] = useState(null);
    const [error, setError] = useState('');

    const types = ['image/png', 'image/jpeg']; // image types
    const navigate = useNavigate(); // initializing the navigate function

    const productImgHandler = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            setProductImg(selectedFile);
            setError('');
        } else {
            setProductImg(null);
            setError('Please select a valid image type (jpg or png)');
        }
    }

    // add product
    const addProduct = async (e) => {
        e.preventDefault();

        const storageRef = ref(storage, `product-images/${productImg.name}`);
        const uploadTask = uploadBytesResumable(storageRef, productImg);

        uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        },
            err => {
                setError(err.message);
            },
            async () => {
                try {
                    const url = await getDownloadURL(storageRef);
                    await addDoc(collection(db, 'Products'), {
                        ProductName: productName,
                        ProductPrice: Number(productPrice),
                        ProductImg: url
                    });

                    setProductName('');
                    setProductPrice(0);
                    setProductImg(null);
                    setError('');
                    document.getElementById('file').value = '';

                    toast.success('Product added successfully!'); // toast message
                    navigate('/'); // navigating to the home page

                } catch (err) {
                    setError(err.message);
                }
            });
    }

    // delete all products
    const deleteAllProducts = async () => {
        try {
            // Fetch all documents in the 'Products' collection
            const querySnapshot = await getDocs(collection(db, 'Products'));

            // If there are no documents, notify the user
            if (querySnapshot.empty) {
                toast.info('No products to delete.');
                return;
            }

            // Iterate over each document and delete it
            const promises = querySnapshot.docs.map((document) => {
                console.log(`Deleting document with ID: ${document.id}`);
                return deleteDoc(doc(db, 'Products', document.id));
            });

            // Wait for all delete operations to complete
            await Promise.all(promises);

            // Notify the user of success
            toast.success('All products deleted successfully!');
        } catch (err) {
            // Log and display any errors encountered
            console.error('Error deleting products:', err);
            setError(err.message);
            toast.error('Failed to delete products. Check the console for more details.');
        }
    }

    return (
        <div className='container'>
            <br />
            <h2>ADD PRODUCTS</h2>
            <hr />
            <form autoComplete="off" className='form-group' onSubmit={addProduct}>
                <label htmlFor="product-name">Product Name</label>
                <input type="text" className='form-control' required
                    onChange={(e) => setProductName(e.target.value)} value={productName} />
                <br />
                <label htmlFor="product-price">Product Price</label>
                <input type="number" className='form-control' required
                    onChange={(e) => setProductPrice(e.target.value)} value={productPrice} />
                <br />
                <label htmlFor="product-img">Product Image</label>
                <input type="file" className='form-control' id="file" required
                    onChange={productImgHandler} />
                <br />
                <button type="submit" className='btn btn-success btn-md mybtn'>ADD</button>
                <button type="button" className='btn btn-danger btn-md mybtn' onClick={deleteAllProducts}>DELETE ALL PRODUCTS</button>
            </form>
            {error && <span className='error-msg'>{error}</span>}
        </div>
    )
}
