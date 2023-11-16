import './styleConditions.css';
import React, { useEffect } from 'react';
import axios from "axios";

import { SearchOutlined } from '@ant-design/icons'

import jsdata from './sampledata.json';

export default function ConditionSearch() {

    // sending a get request to server
    const fetchData = () => {
        axios.get('http://localhost:3001/api/conditiondata/').then((res) => {
           
            let data; 
            console.log("rows retrieved:" +res.data.length);
            // check if data was properly fetched or not
            if (res.data.length > 0) {data = res.data} else { data = jsdata };
            updateTable(data);

        }).catch(function (error) {
            console.log(error);
            updateTable(jsdata);
        });
       
        return true;
    }

    const updateTable = (data) => {
        let tbody = document.getElementById('table-body');
        let rows = "";
        // iterate for all conditions data
        data.forEach((ele) => {
            console.log(ele);
            rows +='<tr><td  valign="top">' + ele.conditions + '</td><td>' + ele.description + '</td><td>' + ele['causes and symptoms'] + '</td></tr>';
        });
        // update table body
        tbody.innerHTML = rows;
    }
    // Fetch data once DOM is laoded
    useEffect(() => {
        // Fetch data from server
        fetchData();
      });

    const searchFunc = () => {
        let filter = document.getElementById('myInput').value.toUpperCase();
        let myTable = document.getElementById('table-body');
        let tr = myTable.getElementsByTagName('tr');
        for (var i = 0; i < tr.length; i++) {
            let found=0;
            for (var j = 0; j < tr[i].childElementCount; j++) {
                let td = tr[i].getElementsByTagName('td')[j];
                if (td) {
                    let textvalue = td.textContent || td.innerHTML;
                    if (textvalue.toUpperCase().indexOf(filter) > -1) {
                        found=1;
                    }
                }
            }
            if (found === 1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    return (
        <main>
        <div className="search-condition">
            <div className="cs-container">
                <div className="cs-title">
                    <h1>
                        Search your conditon
                    </h1>
                </div>
                <div className="searchbox">
                    <label for="keywords"> Search Conditions</label>
                    <div className="d-flex">
                        <div className="search-area">
                            <input list="keywords" name="keywords" id="myInput" className="cs-form-control"
                                placeholder="Type your condition" onKeyUp={searchFunc}></input>
                        </div>
                        <div className="search-btn">                    
                            <SearchOutlined className="cs-form-control" onClick={searchFunc}/> 
                        </div>
                    </div>
                </div>
                <div className="list-of-diseases">
                    <div className="cs-title">
                        <h2>
                            List of conditions
                        </h2>
                    </div>
                    <table id="myTable">
                        <thead>
                            <tr>
                            <th>
                                Name 
                            </th>
                            <th>
                                Descrption
                            </th>
                            <th>
                                Causes and symptoms
                            </th>
                            </tr>
                        </thead>
                        <tbody id="table-body">
                        
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </main>
        
        
    );

}
