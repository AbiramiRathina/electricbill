import React, { useState, useEffect } from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { API ,graphqlOperation } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import awsconfig from './aws-exports';
import { createTodo as createTodoMutation, updateTodo as updateTodoMutation, deleteTodo as deleteTodoMutation } from './graphql/mutations';

Amplify.configure(awsconfig);
const initialFormState = { deviceName: '', watts: 0 ,hours:0}
const initialedit = {id:'', deviceName: '', watts: 0 ,hours:0}
const totval=0;

function App() {
  const [devices, setDevice] = useState([]);
  const [wattVal, setWatt] = useState([]);
  const [hourVal, setHour] = useState([]);
  const [wattandhours, setwattandhours] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [edit,setEdit]=useState(initialedit);
  const [isedit,setIsedit]=useState(0);
  const bill=[];
  useEffect(() => {
    fetchTodos();
  }, [edit]);

  async function fetchTodos() {
    const apiData = await API.graphql(graphqlOperation(listTodos));
    const deviceList=(apiData.data.listTodos.items);
    const wattValList=(apiData.data.listTodos.items[1]);
    const hourValList=(apiData.data.listTodos.items[2]);
    const wattandhoursList=(apiData.data.listTodos.items[1]*apiData.data.listTodos.items[2]);
    console.log(deviceList);
    setDevice(deviceList);
    console.log(wattValList);
    setWatt(wattValList);
    console.log(hourValList);
    setHour(hourValList);
    console.log(wattandhoursList);
    setwattandhours(wattandhoursList);
    for(let i=0;i<wattValList.length; i+=1)
    {
      let temp=wattValList[i].watts;
      bill.push(temp);
    }
  }

  async function createTodo() {
    if (!formData.deviceName || !formData.watts || !formData.hours) return;
    await API.graphql({ query: createTodoMutation, variables: { input: formData } });
    setDevice([ ...devices, formData ]);
    setFormData(initialFormState);
  }

  async function displayTodo({id}) {
    const  curr=devices.filter(device => device.id===id);
    setEdit({'id':curr[0].id,'deviceName': curr[0].deviceName, 'watts':curr[0].watts ,'hours':curr[0].hours })
    setIsedit(1);

   }

  async function deleteTodo({ id }) {
    const newDeviceArray = devices.filter(device => device.id !== id);
    setDevice(newDeviceArray);
    await API.graphql({ query: deleteTodoMutation, variables: { input: { id } }});
  }

  async function updateTodo() {
    if (!edit.deviceName || !edit.watts || !edit.hours) return;
    console.log(edit);
    await API.graphql({ query: updateTodoMutation, variables: { input: edit } });
    setFormData(initialFormState);
    setEdit(initialedit);

    setIsedit(0);

  }
  
  
  
    async function count()
    {
      const totval=0;

      for (var i=0; i<wattandhours.length ;i++)
      {
        totval=totval+wattandhours[i]
      }
      return totval;
      // const apiData = await API.graphql(graphqlOperation(listTodos));
      // const wattVal=(apiData.data.listTodos.items[1]);
      // const hourVal=(apiData.data.listTodos.items[2]);
      // const name='df';
       alert("d");
    }
  

  return (
    <div className="App">
      <h1>Electricity Bill Estimator</h1>
      <div>
        {isedit===0 ?(

          <div>
            
            <select onChange={e=> setFormData({ ...formData, 'deviceName' :e.target.value})}
              placeholder="select appliance"
              value={formData.deviceName}>
              <option value={""}></option>
              <option value={"light bulb"}>light bulb</option>
              <option value={"TV"}>TV</option>
              <option value={"Air cooler"}>Air cooler</option>
              <option value={"Ceiling Fan"}>Ceiling Fan</option>
              <option value={"Fridge"}>Fridge</option>
            </select>
            
            

            <input
              onChange={e=> setFormData({ ...formData, 'watts' :e.target.value})}
              placeholder="enter watts"
              value={formData.watts}
            />

            <input
              onChange={e=> setFormData({ ...formData, 'hours' :e.target.value})}
              placeholder="enter hours"
              value={formData.hours}
            />

            <button onClick={createTodo}>add device</button>
            
          </div>
        ) : (

          <div>

            <select onChange={e=> setEdit({ ...edit, 'deviceName' :e.target.value})}
              placeholder="select appliance"
              value={edit.deviceName}>
              <option value={""}></option>
              <option value={"light bulb"}>light bulb</option>
              <option value={"TV"}>TV</option>
              <option value={"Air cooler"}>Air cooler</option>
              <option value={"Ceiling Fan"}>Ceiling Fan</option>
              <option value={"Fridge"}>Fridge</option>
            </select>
            

            

            <input
              onChange={e=> setEdit({ ...edit, 'watts' :e.target.value})}
              placeholder="watts"
              value={edit.watts}
            />
            <p>W</p>
            <input
              onChange={e=> setEdit({ ...edit, 'hours' :e.target.value})}
              placeholder="hours"
              value={edit.hours}
            />
            <p>hr</p>
            <button onClick={updateTodo}>update device</button>
            
          </div>

        )}

        </div>
        <br></br>
        <table>
          
          <tbody>
          <tr>
              <th>APPLIANCE</th>
              <th>WATTS</th>
              <th>HOURS</th>
            </tr>
            {
              devices.map(device =>
                (<tr key={devices.device}>
                    <td>{device.deviceName}</td>
                    <td>{device.watts}</td>
                    <td>{device.hours}</td>
                    
                    <button onClick={() => displayTodo(device)}>update</button>
                    <button onClick={() => deleteTodo(device)}>Remove</button>
                    
                  </tr>
                  )
                )
  
            
            }
          </tbody>
        </table>
        <br></br><br></br><br></br>
        <h4>Bill</h4>
        


        <table>
          
          <tbody>
          <tr>
              <th>Number of watts</th>
              <th>Number of hours</th>
              <th>Amount in Rupees</th>
            </tr>
            {
              devices.map(device =>
                (<tr key={devices.device}>
                    <td>{device.watts}</td>
                    <td>{device.hours}</td>
                    <td>{((device.watts*device.hours)/1000)*15}</td>
                  </tr>
                  )
                )
  
            
            }
          </tbody>
        </table>
        <br></br><br></br>
       

        
              
    </div>
  );
}

export default withAuthenticator(App);