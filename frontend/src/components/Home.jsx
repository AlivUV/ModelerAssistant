import NavBar from "./NavBar";
import { Link } from 'react-router-dom';
import { useEffect } from "react";

// Components
import Footer from "./Footer";

function Home() {

    const setSizeCardsTech = () => {
        var width = 324 * window.innerWidth / 1879
        var height = 143 * width / 324
        var elements = document.getElementsByClassName('card-technologies')
        var contTechnologies = document.getElementById('cont-technologies')

        Array.from(elements).forEach(element => {
            element.style.width = width + 'px'
            element.style.height = height + 'px'
        });

        elements[0].style.left = (0.375 * window.innerWidth) - (width / 2) + 'px'
        elements[0].style.top = (0.145 * contTechnologies.offsetHeight) - (height / 2) + 'px'
        elements[1].style.left = (0.618 * window.innerWidth) - (width / 2) + 'px'
        elements[1].style.top = (0.145 * contTechnologies.offsetHeight) - (height / 2) + 'px'
        elements[2].style.left = (0.256 * window.innerWidth) - (width / 2) + 'px'
        elements[2].style.top = (0.50 * contTechnologies.offsetHeight) - (height / 2) + 'px'
        elements[3].style.left = (0.49 * window.innerWidth) - (width / 2) + 'px'
        elements[3].style.top = (0.50 * contTechnologies.offsetHeight) - (height / 2) + 'px'
        elements[4].style.left = (0.742 * window.innerWidth) - (width / 2) + 'px'
        elements[4].style.top = (0.50 * contTechnologies.offsetHeight) - (height / 2) + 'px'
        elements[5].style.left = (0.375 * window.innerWidth) - (width / 2) + 'px'
        elements[5].style.top = (0.855 * contTechnologies.offsetHeight) - (height / 2) + 'px'
        elements[6].style.left = (0.618 * window.innerWidth) - (width / 2) + 'px'
        elements[6].style.top = (0.855 * contTechnologies.offsetHeight) - (height / 2) + 'px'
    }

    useEffect(() => {
        window.onresize = () => {
            setSizeCardsTech()
        }
    }, []);

    return (
        <div className="bg-one" onLoad={() => setSizeCardsTech()}>
            <NavBar />

            <div className="d-flex justify-content-center align-items-center p-5 mx-5">
                <div className="w-60 p-5">
                    <img className="diagram-home rounded w-100" src="/img/diagram.webp" alt="diagram" />
                </div>
                <div className="w-40 p-5">
                    <h1 className="text-white fw-bold fs-48">SmartCopilot</h1>
                    <p className="text-white">This project proposes a solution to the problem of requirements specification using a model called EBPM (Enriched Business Process Model), which allows assigning additional functionalities to the processes specified by means of BPMs, and then generating the user stories automatically.</p>
                    <Link className="btn-three text-decoration-none py-2" to="/projects">Create new project</Link>
                </div>
            </div>

            {/* Divider 1 */}
            <div className="bg-one">
                <img className="w-100" src="/img/divider1.svg" alt="divider1" />
            </div>

            {/* Technologies */}
            <div className="bg-two pt-5">
                <h2 className="text-center fw-bold">Technologies</h2>

                <div className="py-5">
                    <div id="cont-technologies" className="d-flex position-relative">
                        <img className="w-100" src="/img/styleTechnologies.svg" alt="style technologies" />

                        {/* React */}
                        <div className="card-technologies rounded bg-white shadow-lg">
                            <img className="h-50" src="/img/react.webp" alt="react" />
                        </div>

                        <div className="card-technologies rounded bg-white shadow-lg">
                            <img className="h-50" src="/img/django.webp" alt="django" />
                        </div>

                        <div className="card-technologies rounded bg-white shadow-lg">
                            <img className="h-50" src="/img/bootstrap5.webp" alt="bootstrap5" />
                        </div>

                        <div className="card-technologies rounded bg-white shadow-lg">
                            <img className="h-50" src="/img/bpmnio.webp" alt="bpmnio" />
                        </div>

                        <div className="card-technologies rounded bg-white shadow-lg">
                            <img className="h-50" src="/img/postgresql.webp" alt="postgresql" />
                        </div>

                        <div className="card-technologies rounded bg-white shadow-lg">
                            <img className="h-50" src="/img/spacy.webp" alt="bootstrap5" />
                        </div>

                        <div className="card-technologies rounded bg-white shadow-lg">
                            <img className="h-50" src="/img/github.webp" alt="github" />
                        </div>
                    </div>
                </div>
            </div>

            <Footer></Footer>
        </div>
    );
}

export default Home;