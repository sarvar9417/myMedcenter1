import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import Modal from 'react-modal';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


export const Adoption = () => {
    const { request, loading } = useHttp()
    const sectionId = useParams().id
    const auth = useContext(AuthContext)
    const [section, setSection] = useState()
    const history = useHistory()
    const [client, setClient] = useState({
        id: "",
        lastname: "",
        firstname: "",
        fathername: "",
        born: "",
        phone: "",
        price: ""
    })

    //Modal oyna
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }


    const getSection = useCallback(async () => {
        try {
            console.log(sectionId);
            const fetch = await request(`/api/section/doctor/${sectionId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(fetch);
            getClient(fetch.client)
            setSection(fetch)
        } catch (error) {

        }
    }, [request, auth, sectionId])

    const getClient = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/clients/doctor/${id}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {

        }
    }, [request, auth])

    const changeHandlar = (event) => {
        setSection({ ...section, [event.target.name]: event.target.value })
    }
    const checkUp = (event) => {
        setSection({ ...section, [event.target.name]: event.target.id })
        openModal()
    }

    const dontCome = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctordontcome/${sectionId}`, 'PUT', { checkUp: "kelmagan" }, {
                Authorization: `Bearer ${auth.token}`
            })
            history.push(`/doctor`)
        } catch (e) {

        }
    }, [request, auth])


    const doneCome = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctordone/${sectionId}`, 'PUT',
                {
                    checkUp: "kelgan",
                    comment: section.comment,
                    summary: section.summary,
                    done: "tasdiqlangan"
                },
                {
                    Authorization: `Bearer ${auth.token}`
                })
            console.log(fetch)
            history.push(`/doctor`)
        } catch (e) {

        }
    }, [request, auth, section, sectionId])

    useEffect(() => {
        getSection()
    }, [getSection])

    return (
        <div style={{ marginTop: "70px" }}>
            <div className="container-lg">
                <div style={{ textAlign: "right", }}>
                    <h1 style={{ color: "#14A479", marginBottom: "50px" }}>MedicalCenter For Navoi</h1>
                    <h3>MedicalCenter Islom</h3>
                    <p style={{ margin: "0", fontWeight: "500" }}>"Nosirov Islom MedicalCenter"</p>
                    <p style={{ margin: "0", fontWeight: "500" }}>Naviy Navoiy 42</p>
                    <p style={{ margin: "0", fontWeight: "500" }}>Uzbekistan Naviy Navoiy</p>
                    <p style={{ margin: "0", fontWeight: "500" }}>+12312367890</p>
                    <p style={{ margin: "0", fontWeight: "500" }}>nosirovislom071221312@gmail.com</p>

                </div>
                <div className="forms">
                    <h2 style={{ color: "#14A479" }}>Mijoz ma'lumotlari</h2>
                    <div className="row mt-5">
                        <div className="col-md-2 col-sm-4">
                            <label style={{ fontSize: "20px", marginRight: "20%" }}>
                                ID:
                            </label>
                        </div>
                        <div className="col-md-4 col-sm-8">
                            <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                {client.id}
                            </h3>
                        </div>
                        <div className="col-md-2 col-sm-4">
                            <label style={{ fontSize: "20px", marginRight: "16.5%" }}>
                                F.I.O:
                            </label>
                        </div>
                        <div className="col-md-4 col-sm-8">
                            <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                {client.firstname} {client.lastname} {client.fathername}
                            </h3>
                        </div>
                        <div className="col-md-2 col-sm-4">
                            <label style={{ fontSize: "20px", marginRight: "4%" }}>
                                Tug'ilgan yili:
                            </label>
                        </div>
                        <div className="col-md-4 col-sm-8">
                            <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                {new Date(client.born).toLocaleDateString()}
                            </h3>
                        </div>
                        <div className="col-md-2 col-sm-4">
                            <label style={{ fontSize: "20px", marginRight: "13%" }}>
                                Phone:
                            </label>
                        </div>
                        <div className="col-md-4 col-sm-8">
                            <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                +{client.phone}
                            </h3>
                        </div>
                        <div className="col-md-2 col-sm-4">
                            <label style={{ fontSize: "20px", marginRight: "15%" }}>
                                Navbati:
                            </label>
                        </div>
                        <div className="col-md-4 col-sm-8">
                            <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                {section && (section.turn ? section.turn : section.bronTime)}
                            </h3>
                        </div>
                        <div className="col-md-2 col-sm-4">
                            <label style={{ fontSize: "20px", marginRight: "15%" }}>
                                To'lov(holati):
                            </label>
                        </div>
                        <div className="col-md-4 col-sm-8">
                            <h3 className="w-100 px-4" style={{ border: "none", background: "#E1FFF7", outline: "none", fontSize: "20px", padding: "5px", fontWeight: "600" }}>
                                {section && section.price} so'm ({section && section.payment})
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="tt">

                    <h1 className="mt-5" style={{ marginBottom: "50px", textAlign: "center" }}>MedicalCenter For Navoi</h1>
                    <h3>Izoh:</h3>
                    <textarea name="comment" onChange={changeHandlar} style={{ height: "100px" }} className="form-control" ></textarea>
                    <br />
                    <h3>Xulosa:</h3>
                    <textarea name="summary" onChange={changeHandlar} style={{ height: "200px" }} className="form-control" ></textarea>

                    <div className="row mt-5 mb-5">
                        <div className="col-4">
                            <button id="kelmagan" name="checkup" onClick={checkUp} className="btn btn-danger">Mijoz kelmadi</button>
                        </div>
                        <div className="col-4">
                            <button className="btn" onClick={doneCome} style={{ color: "#fff", backgroundColor: "#14A479" }}>Tasdiqlash</button>
                        </div>
                    </div>
                </div>
            </div >





            {/* Modal oynaning ochilishi */}
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className="row m-1">
                        <div className="col-12 text-center">
                            <button onClick={dontCome} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                            <button onClick={closeModal} className="btn btn-danger" >Qaytish</button>
                        </div>
                    </div>

                </Modal>
            </div>

        </div >
    )
}