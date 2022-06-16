/* eslint-disable */
import React, {useEffect, useState} from 'react'
import {Button, Card, CardFooter, CardHeader, Col, Container, Input, Row, Table} from "reactstrap"
import Select from 'react-select'
import axios from "axios";
import Pagination from "react-js-pagination";
import _ from "lodash";
import buildUrl from 'build-url';
// core components
import Header from "components/Headers/Header.js"

const Sikoper = () => {

  const [state, setState] = useState({
    field: {value: 'title', label: 'Title'},
    fieldOptions: [
      {value: 'title', label: 'Title'},
      {value: 'description', label: 'Description'},
      {value: 'creator', label: 'Creator'},
      {value: 'subject', label: 'Subject'},
      {value: 'format', label: 'Format'},
      {value: 'publisher', label: 'Publisher'},
      {value: 'language', label: 'Language'},
    ],
    value: '',
    activePage: 1,
    start: 0,
    itemsCountPerPage: 10,
    totalItemsCount: 0,
    pageRangeDisplayed: 5,
    data: null,
  })

  useEffect(() => {
    getData(state.activePage)
  }, [])

  const getData = (pageNumber) => {
    let params = {
      start: _.isEqual(pageNumber, 1) ? 0 : (pageNumber * state.itemsCountPerPage) - state.itemsCountPerPage,
      rows: state.itemsCountPerPage,
      field: state.field.value,
      value: _.isEmpty(state.value) ? '*' : state.value
    }
    // console.log(params)
    let url = buildUrl(`http://localhost:8081/`, {
      path: '/solr/grid',
      queryParams: params
    });
    console.log(url)
    axios.get(url,)
      .then(res => {
        // console.log(res.data);
        setState((prevProps) => ({
          ...prevProps,
          data: res.data.response.docs,
          totalItemsCount: res.data.response.numFound,
          activePage: pageNumber
        }))
      })
      .catch(err => {
        console.error(err);
      });
  }

  const handleField = (obj) => {
    setState((prevProps) => ({
      ...prevProps,
      field: obj
    }))
  }

  const handleKeyword = (obj) => {
    setState((prevProps) => ({
      ...prevProps,
      value: obj.target.value
    }))
  }

  const onClickButton = () => {
    getData(1)
  }

  const handlePageChange = (pageNumber) => {
    setState((prevProps) => ({
      ...prevProps,
      activePage: pageNumber,
    }))
    getData(pageNumber)
  }


  if (_.isNull(state.data)) {
    return <>Loading...</>
  }

  return (
    <>
      {console.log(state)}
      <Header/>
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row>
                  <Col md="4">
                    <Select
                      value={state.field}
                      onChange={handleField}
                      options={state.fieldOptions}
                    />
                  </Col>
                  <Col md="4">
                    <Input
                      placeholder="Kata kunci"
                      type="text"
                      value={state.keyword}
                      onChange={handleKeyword}
                    />
                  </Col>
                  <Col md="4">
                    <Button
                      onClick={onClickButton}
                      color="primary">
                      Cari
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                <tr>
                  <th scope="col">title</th>
                </tr>
                </thead>
                <tbody className="list">
                {state.data.map((d, i) => {
                  return (
                    <tr key={i}>
                      <td className="font-weight-bold">{d.title[0]}</td>
                    </tr>
                  )
                })}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                Terdapat: <strong>{state.totalItemsCount}</strong> data
                <Pagination
                  innerClass="pagination justify-content-center fs16"
                  itemClass="page-item"
                  linkClass="page-link"
                  prevPageText="⟨"
                  nextPageText="⟩"
                  activePage={state.activePage}
                  itemsCountPerPage={state.itemsCountPerPage}
                  totalItemsCount={state.totalItemsCount}
                  pageRangeDisplayed={state.pageRangeDisplayed}
                  onChange={handlePageChange}
                />
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Sikoper;
