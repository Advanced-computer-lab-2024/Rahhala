import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import { AuthContext } from '../../../context/AuthContext';
import AdminHeader from './AdminHeader';


const NewAccountRequests = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { auth } = useContext(AuthContext);
    const [tourGuides, setTourGuides] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [advertisers, setAdvertisers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTourGuide, setSelectedTourGuide] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [selectedAdvertiser, setSelectedAdvertiser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try{
                const res = await axiosInstance.get('/api/admin/viewUsersInfo')
                setTourGuides(res.data.tourGuideDocuments);
                setSellers(res.data.sellerDocuments);
                setAdvertisers(res.data.advertiserDocuments);
            } catch (error) {
                alert('An error occurred');
                console.error(error);
            }
        }
        fetchRequests();
    }, [auth]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleAccept = async (type,id) => {
        try{
            if(type === 'TourGuide'){
                await axiosInstance.put(`/api/admin/acceptTourGuide/${id}`);
            } else if(type === 'Seller'){
                await axiosInstance.put(`/api/admin/acceptSeller/${id}`);
            } else if(type === 'Advertiser'){
                await axiosInstance.put(`/api/admin/acceptAdvertiser/${id}`);
            }
            alert(`${type} accepted successfully!`);
            window.location.reload();
        } catch (error) {
            alert(`Error accepting ${type.toLowerCase()}.`);
            console.error(`Error accepting ${type.toLowerCase()}:`, error);
        }
    }

    const handleReject = async (type,id) => {
        try{
            if(type === 'TourGuide'){
                await axiosInstance.put(`/api/admin/rejectTourGuide/${id}`);
            } else if(type === 'Seller'){
                await axiosInstance.put(`/api/admin/rejectSeller/${id}`);
            } else if(type === 'Advertiser'){
                await axiosInstance.put(`/api/admin/rejectAdvertiser/${id}`);
            }
            alert(`${type} rejected successfully!`);
            window.location.reload();
        } catch (error) {
            alert(`Error rejecting ${type.toLowerCase()}.`);
            console.error(`Error rejecting ${type.toLowerCase()}:`, error);
        }
    }

    const renderTourGuides = () => {
        return tourGuides.map((guide) => (
            <div key={guide._id} className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                <h3 className="text-lg font-semibold">{guide.username}</h3>
                <p><strong>Email:</strong> {guide.email}</p>
                <p><strong>Mobile Number:</strong> {guide.mobileNumber}</p>
                <div className="flex space-x-2 mt-2">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => {
                            setIsModalOpen(true)
                            setSelectedTourGuide(guide)
                            setSelectedSeller(null)
                            setSelectedAdvertiser(null)
                        }}
                    >
                        More Info
                    </button>
                    <button 
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => handleAccept('TourGuide', guide._id)}
                    >
                        Accept
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => handleReject('TourGuide', guide._id)}
                    >
                        Reject
                    </button>

                </div>
            </div>
        ));
    };    

    const renderTourGuideMoreInfo = () => {
        if (!selectedTourGuide) return null;
        if(imageModalOpen){
            return(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={selectedImage} alt="Enlarged" className="max-w-full max-h-full" />
                        <button onClick={()=>{setImageModalOpen(false); setSelectedImage(null)}} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )
        }
        return(
            <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                <h3 className="text-lg font-semibold">{selectedTourGuide.username}</h3>
                <p><strong>ID:</strong></p>
                <img
                    src={selectedTourGuide.idCardImage ? `data:image/jpeg;base64,${selectedTourGuide.idCardImage}` : '/path/to/default/image.jpg'}
                    alt="ID"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${selectedTourGuide.idCardImage}`);
                        setImageModalOpen(true);
                }}
                />

                <p><strong>Profile Photo:</strong></p>
                <img
                    src={selectedTourGuide.profilePhoto ? `data:image/jpeg;base64,${selectedTourGuide.profilePhoto}` : '/path/to/default/image.jpg'}
                    alt="Profile"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${selectedTourGuide.profilePhoto}`);
                        setImageModalOpen(true);
                }}
                />
                <p><strong>Certifications:</strong></p>
                {selectedTourGuide.certificationImages.map((img, index) => (
                    <img
                        key={index}
                        src={img ? `data:image/jpeg;base64,${img}` : '/path/to/default/image.jpg'}
                        alt={`Certification ${index + 1}`}
                        className="w-12 h-12 object-cover rounded-md"
                        onClick = {() => {  
                            setSelectedImage(`data:image/jpeg;base64,${selectedTourGuide.certificationImages[index]}`);
                            setImageModalOpen(true);
                        }}
    
                    />
                    ))}
                <div className="flex space-x-2 mt-2">
                </div>
            </div>
        );
    }

    const renderSellers = () => {
        if (sellers.length===0) return null;
        if(imageModalOpen){
            return(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={selectedImage} alt="Enlarged" className="max-w-full max-h-full" />
                        <button onClick={()=>{setImageModalOpen(false); setSelectedImage(null)}} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )
        }

        return sellers.map((seller) => (
            <div key={seller._id} className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                <h3 className="text-lg font-semibold">{seller.username}</h3>
                <p><strong>Logo:</strong></p>
                <img
                    src={seller.logo ? `data:image/jpeg;base64,${seller.logo}` : '/path/to/default/image.jpg'}
                    alt="Logo"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${seller.logo}`);
                        setImageModalOpen(true);
                }}
                />

                <p><strong>Email:</strong> {seller.email}</p>
                <p><strong>Name:</strong> {seller.name}</p>
                <p><strong>Description:</strong> {seller.description}</p>

                <div className="flex space-x-2 mt-2">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => {
                            setIsModalOpen(true)
                            setSelectedTourGuide(null)
                            setSelectedSeller(seller)
                            setSelectedAdvertiser(null)
                        }
                    }>
                        More Info
                    </button>
                    <button 
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => handleAccept('Seller', seller._id)}
                    >
                        Accept
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => handleReject('Seller', seller._id)}
                    >
                        Reject
                    </button>
                </div>
            </div>
        ));
    };

    const renderSellersMoreInfo = () => {
        if (!selectedSeller) return null;
        if(imageModalOpen){
            return(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={selectedImage} alt="Enlarged" className="max-w-full max-h-full" />
                        <button onClick={()=>{setImageModalOpen(false); setSelectedImage(null)}} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )
        }
        return(
            <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                <h3 className="text-lg font-semibold">{selectedSeller.username}</h3>
                <p><strong>ID:</strong></p>
                <img
                    src={selectedSeller.idCardImage ? `data:image/jpeg;base64,${selectedSeller.idCardImage}` : '/path/to/default/image.jpg'}
                    alt="ID"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${selectedSeller.idCardImage}`);
                        setImageModalOpen(true);
                }}
                />
                <p><strong>Taxation Registry Image:</strong></p>
                <img
                    src={selectedSeller.taxationRegistryImage ? `data:image/jpeg;base64,${selectedSeller.taxationRegistryImage}` : '/path/to/default/image.jpg'}
                    alt="Taxation Registry"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${selectedSeller.taxationRegistryImage}`);
                        setImageModalOpen(true);
                }}
                />
                <div className="flex space-x-2 mt-2">
                </div>
            </div>
        );
    }

    const renderAdvertisers = () => {
        if (advertisers.length===0) return null;
        if(imageModalOpen){
            return(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={selectedImage} alt="Enlarged" className="max-w-full max-h-full" />
                        <button onClick={()=>{setImageModalOpen(false); setSelectedImage(null)}} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )
        }

        return advertisers.map((advertiser) => (
            <div key={advertiser._id} className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                <h3 className="text-lg font-semibold">{advertiser.username}</h3>
                <p><strong>Logo:</strong></p>
                <img
                    src={advertiser.logo ? `data:image/jpeg;base64,${advertiser.logo}` : '/path/to/default/image.jpg'}
                    alt="Logo"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${advertiser.logo}`);
                        setImageModalOpen(true);
                }}
                />
                <p><strong>Email:</strong> {advertiser.email}</p>
                <p><strong>Website Link:</strong> {advertiser.websiteLink}</p>
                <p><strong>Hotline:</strong> {advertiser.hotline}</p>
                <div className="flex space-x-2 mt-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => {
                            setIsModalOpen(true);
                            setSelectedAdvertiser(advertiser);
                            setSelectedTourGuide(null);
                            setSelectedSeller(null);
                        }}
                    >
                        More Info
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => handleAccept('Advertiser', advertiser._id)}
                    >
                        Accept
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => handleReject('Advertiser', advertiser._id)}
                    >
                        Reject
                    </button>
                </div>
            </div>
        ));
    };

    const renderAdvertiserMoreInfo = () => {
        if (!selectedAdvertiser) return null;
        if(imageModalOpen){
            return(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <img src={selectedImage} alt="Enlarged" className="max-w-full max-h-full" />
                        <button onClick={()=>{setImageModalOpen(false); setSelectedImage(null)}} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>
                    </div>
                </div>
            )
        }

        return(
            <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                <h3 className="text-lg font-semibold">{selectedAdvertiser.username}</h3>
                <p><strong>Company Profile:</strong></p>
                <img
                    src={selectedAdvertiser.companyProfile ? `data:image/jpeg;base64,${selectedAdvertiser.companyProfile}` : '/path/to/default/image.jpg'}
                    alt="ID"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${selectedAdvertiser.companyProfile}`);
                        setImageModalOpen(true);
                }}
                />

                <p><strong>ID:</strong></p>
                <img
                    src={selectedAdvertiser.idCardImage ? `data:image/jpeg;base64,${selectedAdvertiser.idCardImage}` : '/path/to/default/image.jpg'}
                    alt="ID"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${selectedAdvertiser.idCardImage}`);
                        setImageModalOpen(true);
                }}
                />
                <p><strong>Taxation Registry Image:</strong></p>
                <img
                    src={selectedAdvertiser.taxationRegistryImage ? `data:image/jpeg;base64,${selectedAdvertiser.taxationRegistryImage}` : '/path/to/default/image.jpg'}
                    alt="Taxation Registry"
                    className="w-16 h-16 rounded-full"
                    onClick = {() => {  
                        setSelectedImage(`data:image/jpeg;base64,${selectedAdvertiser.taxationRegistryImage}`);
                        setImageModalOpen(true);
                }}
                />
                <div className="flex space-x-2 mt-2">
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
        <AdminHeader toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} />
        <button
            onClick={() => navigate(-1)}
            className="text-blue-500 mt-4 ml-4 flex items-center"
        >
            ← Back
        </button>
        <h1 className="text-4xl text-blue-800 font-bold text-center">New Account Requests</h1>

        <div className="flex justify-center mt-10">
        <div className="space-y-4 max-w-xl w-full mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
        {tourGuides.length === 0 ? (
                <h2 className="text-2xl font-bold mb-4">No new TourGuides</h2>
            ) : (
            <>
                <h2 className="text-2xl font-bold mb-4">New TourGuides:</h2>
                {renderTourGuides()}
            </>
            )}
            {sellers.length === 0 ? (
                <h2 className="text-2xl font-bold mb-4">No new Sellers</h2>
            ) : (
            <>
                <h2 className="text-2xl font-bold mb-4">New Sellers:</h2>
                {renderSellers()}
            </>
            )}
            {advertisers.length === 0 ? (
                        <h2 className="text-2xl font-bold mb-4">No new Advertisers</h2>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-4">New Advertisers:</h2>
                            {renderAdvertisers()}
                        </>
                    )}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="space-y-4 w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
                        {selectedTourGuide && renderTourGuideMoreInfo()}
                        {selectedSeller && renderSellersMoreInfo()}
                        {selectedAdvertiser && renderAdvertiserMoreInfo()}

                        <button 
                            onClick={()=> {
                                setIsModalOpen(false)
                                setSelectedTourGuide(null)
                                setSelectedSeller(null)
                                setSelectedAdvertiser(null)
                            }} 
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
        </div>
    );
    };

export default NewAccountRequests;