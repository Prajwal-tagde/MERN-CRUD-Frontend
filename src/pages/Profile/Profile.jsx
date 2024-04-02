import React, { useEffect, useState } from 'react'
import './Profile.css'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Spiner from '../../components/Spiner/Spiner'
import { useParams } from 'react-router-dom'
import { singleUserGetFunc } from '../../services/Apis'
import { BASE_URL } from '../../services/helper'
import moment from 'moment';

const Profile = () => {

  const [showSpin, setShowSpin]  = useState(true);
  const [userProfile, setUserProfile] = useState({});
  const { id } = useParams();   

  const userProfileGet = async () => {
    const res = await singleUserGetFunc(id);

    if(res.status === 200){
      setUserProfile(res.data);
    }
    else{
      console.log('error');
    }
  }

  useEffect(() => {

    userProfileGet();

    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [id])

  return (
    <>
     {
      showSpin ? <Spiner /> : (
        <div className="container">
          <Card className='card-profile shadow col-lg-6 mx-auto mt-5'>
            <Card.Body>
              <Row>
                <div className="col">
                  <div className="card-profile-stats d-flex justify-content-center">
                    <img src={`${BASE_URL}/uploads/${userProfile.profile}`} alt="" />
                  </div>
                </div>
              </Row>
              <div className="text-center">
                <h3>{userProfile.fname+" "+userProfile.lname}</h3>
                <h4><i className="fa-solid fa-envelope email"></i>&nbsp;:- <span>{userProfile.email}</span></h4>
                <h4><i class="fa-solid fa-mobile"></i>&nbsp;:- <span>{userProfile.mobile}</span></h4>
                <h4><i class="fa-solid fa-person"></i>&nbsp;:- <span>{userProfile.gender}</span></h4>
                <h4><i class="fa-solid fa-location-dot location"></i>&nbsp;:- <span>{userProfile.location}</span></h4>
                <h4>Status&nbsp; :- <span>{userProfile.status}</span></h4>
                <h4><i class="fa-solid fa-calendar-days calendar"></i>&nbsp;Date Created&nbsp; :- <span>{moment(userProfile?.datecreated).format("DD-MM-YYYY")}</span></h4>
                <h4><i class="fa-solid fa-calendar-days calendar"></i>&nbsp;Date Updated&nbsp; :- <span>{userProfile?.dateUpdated}</span></h4>
              </div>
            </Card.Body>
          </Card> 
        </div> 
      )
     }
    </>
  )
}

export default Profile
