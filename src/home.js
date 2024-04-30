import React from 'react'
import './home.css'
import logouticon from './images/logout.png'
import { callApi, errorResponse, getSession, setSession } from './main';
import menuicon from './images/menu.png'

const logoutstyle = {"float" : "right", "padding-right" : "5px", "cursor" : "pointer"};
const titlestyle = {"padding-left" : "15px", "font-weight" : "bold"};
const userlabelstyle = {"float" : "right", "padding-right" : "20px"};

export function loadUname(res)
{
   var data = JSON.parse(res);
   var HL1 = document.getElementById("HL1");
   HL1.innerText =` ${data[0].firstname} ${data[0].lastname}`;
}

export function loadMenu(res)
{
    var data = JSON.parse(res);
    var list = "";
    for(var x in data)
    {
        list += `<li>
                    <label id='${data[x].mid}L'>${data[x].mtitle}</label>
                    <div id='${data[x].mid}'></div>
                 </li>`;
    }
    var mlist = document.getElementById("mlist");
    mlist.innerHTML = list;

    for(x in data)
    {
        document.getElementById(`${data[x].mid}L`).addEventListener("click", showSMenu.bind(null, data[x].mid));
    }
}

export function loadSMenu(res)
{
    var data = JSON.parse(res);
    var slist = "";
    for(var x in data)
    {
        slist += `<label id='${data[x].smid}'>${data[x].smtitle}</label>`;
    }
    var smenu = document.getElementById(`${data[0].mid}`);
    smenu.innerHTML = slist;

    for(x in data)
    {
        document.getElementById(`${data[x].smid}`).addEventListener("click", loadModule.bind(null, data[x].smid));
    }
}

export function loadModule(smid)
{
    var titlebar = document.getElementById('titlebar');
    var module = document.getElementById('module');
    switch(smid)
    {
        case "M10102":
            module.src = "/myprofile";
            titlebar.innerText = "My Profile";
            break;
        case "M10103":
            module.src = "/changepassword";
            titlebar.innerText = "Change Password";
            break;
        default:
            module.src="";
            titlebar.innerText="";
    }
}


export function showSMenu(mid)
{
    var surl = "http://localhost:5000/home/menus";
    var ipdata = JSON.stringify({
        mid: mid
    });
    callApi("POST", surl, ipdata, loadSMenu, errorResponse);

    var smenu = document.getElementById(mid);
    if(smenu.style.display === 'block')
        smenu.style.display = 'none';
    else
        smenu.style.display = 'block';
}

class Home extends React.Component
{
    constructor()
    {
        super();
        this.sid = getSession("sid");
        //alert(this.sid);
        if(this.sid === "")
            window.location.replace("/");

        var url = "http://localhost:5000/home/uname";
        var data = JSON.stringify({
            emailid : this.sid
        });
        callApi("POST", url, data, loadUname, errorResponse);

        url = "http://localhost:5000/home/menu";
        callApi("POST", url, "", loadMenu, errorResponse);
    }

    logout()
    {
        setSession("sid", "", -1);
        window.location.replace("/");
    }
    render()
    {
        return(
            <div className='fullheight'>
                <div className='header'>
                    <label style={titlestyle}>SRG Shopping | Shop till you drop.</label>
                    <label style={logoutstyle} onClick={this.logout}>Logout</label>
                    <img src={logouticon} alt='' className='logouticon' onClick={this.logout} />
                    <label id='HL1' style={userlabelstyle}></label>
                </div>
                <div className='content'>
                    <div className='menubar'>
                        <div className='menuheader'>
                            <img src={menuicon} alt='' />
                            <label>Menu</label>
                        </div>
                        <div className='menu'>
                            <nav><ul id='mlist' className='mlist'></ul></nav>
                        </div>
                    </div>
                    <div className='outlet'>
                        <div id='titlebar'></div>
                        <iframe id='module' src="" title='module'></iframe>
                    </div>
                </div>
                <div className='footer'>Copyright @SRG Shopping. All rights reserved.</div>
            </div>
        );
    }
}

export default Home;