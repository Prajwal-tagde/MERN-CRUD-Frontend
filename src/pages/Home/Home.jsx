import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';
import Tables from '../../components/Tables/Tables';
import Spiner from '../../components/Spiner/Spiner';
import { addData, delData, updateData } from '../../components/context/ContextProvider';
import Alert from 'react-bootstrap/Alert';
import { deleteFun, exportToCsvFunc, userGetFunc } from '../../services/Apis';
import { toast } from 'react-toastify';

const Home = () => {

  const navigate = useNavigate();
  const [showSpin, setShowSpin]  = useState(true);
  const [userData, setUserData] = useState([]);

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState('new');
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const { userAdd, setUserAdd } = useContext(addData);
  const { update, setUpdate } = useContext(updateData);
  const { deleteData, setDeleteData } = useContext(delData);

  const userGet = async () => {
    const res = await userGetFunc(search, gender, status, sort, page);
    
    if(res.status === 200){
      setUserData(res.data.userData);
      // console.log(res.data.Pagination.pageCount);
      setPageCount(res.data.Pagination.pageCount);
    }
    else{
      console.log('error for get user data');
    }
  }

  // delete user
  const deleteUser = async (id) => {
    const res = await deleteFun(id);

    if(res.status === 200){
      userGet();
      setDeleteData(res.data);
    }
    else{
      toast.error("error");
    }
  }

  // export user
  const exportUser = async () => {
    const res = await exportToCsvFunc();

    if(res.status === 200){
      window.open(res.data.downloadUrl, "blank");
    }
    else{
      toast.error('Error !');
    }
  }

  // pagination
  // handle prev btn
  const handlePrevious = () => {
    setPage(() => {
      if(page === 1) return page;

      return page - 1;
    })
  }

  // handle next btn
  const handleNext = () => {
    setPage(() => {
      if(page === pageCount) return page;
      
      return page + 1;
    })
  }
  

  useEffect(() => {
    
    userGet();

    setTimeout(() => {
      setShowSpin(false);
    }, 1200);

  }, [search, gender, status, sort, page])

  return (
    <>
    {
      userAdd ? (
        <Alert variant='success' onClose={() => setUserAdd("")} dismissible>
          {userAdd.fname.toUpperCase()} Successfully Added
        </Alert>
      ) : ""
    }
    {
      update ? (
        <Alert variant='primary' onClose={() => setUpdate("")} dismissible>
          {update.fname.toUpperCase()} Successfully Updated
        </Alert>
      ) : ""
    }
    {
      deleteData ? (
        <Alert variant='danger' onClose={() => setDeleteData("")} dismissible>
          {deleteData.fname.toUpperCase()} Successfully Deleted
        </Alert>
      ) : ""
    }

     <div className="container">
      <div className="main_div">
        {/* search add btn */}
        <div className="search_add mt-4 d-flex justify-content-between">
          <div className="search col-lg-4">
            <Form className="d-flex">
              <Form.Control 
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="success" className='search_btn'>Search</Button>
            </Form>
          </div>

          <div className="add_btn">
            <Button variant='primary' onClick={() => navigate('/register')}><i class="fa-solid fa-plus"></i>&nbsp;Add User</Button>
          </div>
      </div>
       {/* export, gender, status */}

       <div className="filter_div mt-5 d-flex justify-content-between flex-wrap">
          <div className="export_csv">
            <Button className='export_btn' onClick={exportUser}>Export To CSV</Button>
          </div>

          <div className="filter_gender">
            <h3>Filter By Gender</h3>
            <div className="gender d-flex justify-content-around">
              <Form.Check 
                type={"radio"}
                label={`All`}
                name='gender'
                value={"All"}
                onChange={(e) => setGender(e.target.value)}
                defaultChecked
              />
              <Form.Check 
                type={"radio"}
                label={`Male`}
                name='gender'
                value={"Male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <Form.Check 
                type={"radio"}
                label={`Female`}
                name='gender'
                value={"Female"}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
          </div>

          {/* short by value */}
          <div className="filter_newold">
            <h3>Short By Value</h3>

            <Dropdown className='text-center'>
              <Dropdown.Toggle className='dropdown_btn e-caret-hide' id="dropdown-basic">
                <i class="fa-solid fa-sort"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSort('new')}>New</Dropdown.Item>
                <Dropdown.Item onClick={() => setSort('old')}>Old</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* filter by status */}
          <div className="filter_status">
            <div className="status">
              <h3>Filter By Status</h3>

              <div className="status_radio d-flex justify-content-around flex-wrap">
                <Form.Check 
                  type={"radio"}
                  label={`All`}
                  name='status'
                  value={"All"}
                  defaultChecked
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Form.Check 
                  type={"radio"}
                  label={`Active`}
                  name='status'
                  value={"Active"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Form.Check 
                  type={"radio"}
                  label={`InActive`}
                  name='status'
                  value={"InActive"}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
            </div>
          </div>

       </div>
 
      </div>

      {
        showSpin ? <Spiner /> : <Tables 
                                  userData={userData} 
                                  deleteUser={deleteUser} 
                                  userGet={userGet} 
                                  handleNext={handleNext}
                                  handlePrevious={handlePrevious}
                                  page={page}
                                  pageCount={pageCount}
                                  setPage={setPage}
                                />
      }

     </div> 
    </>
  )
}

export default Home
