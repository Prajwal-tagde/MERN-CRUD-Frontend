import React from 'react'
import './table.css'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import { BASE_URL } from '../../services/helper'
import { NavLink } from 'react-router-dom'
import { statusChangeFunc } from '../../services/Apis'
import { ToastContainer, toast } from 'react-toastify'
import Paginations from '../Paginations/Paginations'

const Tables = ({ userData, deleteUser, userGet, handleNext, handlePrevious, page, pageCount, setPage }) => {

  const handleChange = async (id, status) => {
    const res = await statusChangeFunc(id, status);
    if(res.status === 200){
      userGet();
      toast.success("Status Updated");
    }
    else{
      toast.error('Error Occured While updating status');
    }
  }

  return (
    <div className='container'>
      <Row>
        <div className="col mt-0">
          <Card className='shadow'>
            <Table className='align-items-center' responsive="sm">
              <thead className='thead-dark'>
                  <tr className="table-dark">
                    <th>ID</th>
                    <th>FullName</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Profile</th>
                    <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                {
                  userData.length > 0 ? userData.map((curVal, index) => {
                    return (
                      <tr>
                        <td>{index + 1 + (page - 1) * 4}</td>  
                        {/* // 0 + 1 + (1-1) * 4 = 1 */}
                        {/* // 0 + 1 + (2 - 1) * 4 = 5 */}
                        <td>{curVal.fname+" "+curVal.lname}</td>
                        <td>{curVal.email}</td>
                        <td>{curVal.gender === "Male" ? "M" : "F"}</td>
                        <td className='d-flex align-items-center'>
                          <Dropdown className='text-center'>
                            <Dropdown.Toggle className='dropdown_btn e-caret-hide' id="dropdown-basic">
                              <Badge bg={curVal.status == "Active" ? "primary" : "danger"}>
                                {curVal.status} <i class="fa-solid fa-angle-down"></i>
                              </Badge>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleChange(curVal._id, "Active")}>Active</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleChange(curVal._id, "InActive")}>InActive</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>

                        <td className='img_parent'>
                          <img src={`${BASE_URL}/uploads/${curVal.profile}`} alt="img" />
                        </td>

                        <td>
                          <Dropdown className='text-center'>
                            <Dropdown.Toggle variant='light' className='action' id="dropdown-basic">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item>
                                <NavLink to={`/userprofile/${curVal._id}`} className="text-decoration-none">
                                  <i class="fa-solid fa-eye" style={{color: 'green'}}></i> <span>View</span>
                                </NavLink>
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <NavLink to={`/edit/${curVal._id}`} className="text-decoration-none">
                                  <i class="fa-solid fa-pen-to-square" style={{color: 'blue'}}></i> <span>Edit</span>
                                </NavLink>
                              </Dropdown.Item>
                              <Dropdown.Item>
                                <div onClick={() => deleteUser(curVal._id)}>
                                  <i class="fa-solid fa-trash" style={{color: 'red'}}></i> <span>Delete</span>
                                </div>
                              </Dropdown.Item>

                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    )
                  }) : (
                    <div className="no_data text-center">
                      No Data Found
                    </div>
                  )
                }
                
               
              </tbody>
            </Table>

            <Paginations 
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              page={page}
              pageCount={pageCount}
              setPage={setPage}
            />

          </Card>
        </div>
      </Row>
      <ToastContainer 
       position='top-center' />
    </div>
  )
}

export default Tables
