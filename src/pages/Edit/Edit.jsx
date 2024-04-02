import React, { useContext, useEffect, useState } from 'react'
import './Edit.css'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spiner from '../../components/Spiner/Spiner';
import { useNavigate, useParams } from 'react-router-dom';
import { editFun, singleUserGetFunc } from '../../services/Apis';
import { BASE_URL } from '../../services/helper';
import { updateData } from '../../components/context/ContextProvider';

const Edit = () => {

  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    location: ""
  });

  // console.log(inputData);

  const [showSpin, setShowSpin]  = useState(true);
  const [userProfile, setUserProfile] = useState({});

  const [status, setStatus] = useState("Active");
  const [imgData, setImgData] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const {update, setUpdate} = useContext(updateData);

  // status options
  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'InActive' },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({...inputData, [name]: value});
  }

  const setStatusValue = (e) => {
      // console.log(e);
      setStatus(e.value);
  }

  // profile 
  const setProfile = (e) => {
    setImage(e.target.files[0]);
  }

  const { id } = useParams();   

  const userProfileGet = async () => {
    const res = await singleUserGetFunc(id);

    if(res.status === 200){
      // setUserProfile(res.data);
      setInputData(res.data);
      setStatus(res.data.status);
      setImgData(res.data.profile);
    }
    else{
      console.log('error');
    }
  }


  // submit user data
  const submitUserData = async (e) => {
    e.preventDefault();

    const { fname, lname, email, mobile, gender, location } = inputData;

    if(fname === ""){
      toast.error("First Name is required!");
    }
    else if(lname === ""){
      toast.error("Last Name is required!");
    }
    else if(email === ""){
      toast.error("Email is required!");
    }
    else if(!email.includes("@")){
      toast.error("Enter valid email!");
    }
    else if(mobile === ""){
      toast.error("Mobile is required!");
    }
    else if(mobile.length > 10){
      toast.error("Enter Valid mobile!");
    }
    else if(gender === ""){
      toast.error("Gender is required!");
    }
    else if(status === ""){
      toast.error("status is required!");
    }
    else if(location === ""){
      toast.error("Location is required!");
    }
    else{
      let data = new FormData();
      data.append('fname', fname);
      data.append('lname', lname);
      data.append('email', email);
      data.append('mobile', mobile);
      data.append('gender', gender);
      data.append('status', status);
      data.append('user_profile', image || imgData);
      data.append('location', location);

      const config = {
        "Content-Type": "multipart/form-data"
      }
  
      const res = await editFun(id, data, config);

      if(res.status === 200){
        setUpdate(res.data);
        navigate('/');
      }

    }
    
  }

  useEffect(() => {
    userProfileGet();
  }, [id]);

  useEffect(() => {
    if(image){
      setImgData("");
      setPreview(URL.createObjectURL(image));
    }

    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [image]);

  return (
    <>
      {
        showSpin ? (
          <Spiner />
        ) : (
          <div className="container">
        <h2 className="text-center mt-1">Update Your Details</h2>
        
        <Card className='shadow mt-3 p-3'>
            <div className="profile_div text-center">
              <img src={image ? preview : `${BASE_URL}/uploads/${imgData}`} alt="img" />
            </div>

            <Form>
              <Row>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name='fname' value={inputData.fname} onChange={handleChange} placeholder='Enter FirstName' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name='lname' value={inputData.lname} onChange={handleChange} placeholder='Enter LastName' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name='email' value={inputData.email} onChange={handleChange} placeholder='Enter Email' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type="text" name='mobile' value={inputData.mobile} onChange={handleChange} placeholder='Enter Mobile' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Select Your Gender</Form.Label>
                  <Form.Check // prettier-ignore
                    type={"radio"}
                    label={`Male`}
                    name='gender'
                    value={"Male"}
                    checked={inputData.gender === "Male" ? true : false}
                    onChange={handleChange}
                  />
                  <Form.Check // prettier-ignore
                    type={"radio"}
                    label={`Female`}
                    name='gender'
                    value={"Female"}
                    checked={inputData.gender === "Female" ? true : false}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Select Your Status</Form.Label>
                  <Select
                      value={status}
                      onChange={setStatusValue}
                      options={options}
                    />
                </Form.Group>

                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Select Your Profile</Form.Label>
                  <Form.Control type="file" onChange={setProfile} name='user_profile' placeholder='Select Your Profile' />
                </Form.Group>

                <Form.Group className="mb-3 col-lg-6" controlId="formBasicEmail">
                  <Form.Label>Enter Your Location</Form.Label>
                  <Form.Control type="text" value={inputData.location} onChange={handleChange} name='location' placeholder='Enter Your Location' />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={submitUserData}>
                  Submit
                </Button>
              </Row>
            </Form>
        </Card>

        <ToastContainer 
          position='top-center'
        />
      </div>
        )
      }
    </>
  )
}

export default Edit
