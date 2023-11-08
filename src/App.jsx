import React, { useState, useEffect } from 'react';
import axios from "axios";
import api from "./api.js";
import List from "./components/List.jsx";
import Main from "./components/Main.jsx";
import Modal from "./components/Modal.jsx";
import {FaFileUpload} from "react-icons/fa";
import CircleMenuButton from "./components/CircleMenuButton.jsx";
import UploadJDCModalContent from "./components/UploadJDCModalContent.jsx";
import {MdCloudDownload} from "react-icons/md";
import JSZip from "jszip";
import { saveAs } from 'file-saver';

export const AppContext = React.createContext();

function App() {
    const [cache, setCache] = useState({
        repositories: {},
        getRepository: async function (idRepository) {
            return this.repositories[idRepository];
        },
        getRepositoryClass: async function (idRepository, idRepositoryClass) {
            console.log(this);
            console.log(this.repositories[idRepository]);
            const repositoryClasses = this.repositories[idRepository].repositoryClasses ;
            if (idRepositoryClass in repositoryClasses) {
                return this.repositories[idRepository].repositoryClasses[idRepositoryClass];
            } else {
                try {
                    const response = await axios.get(api.getRepositoryClassUrl(idRepository, idRepositoryClass))
                    return {
                        repositoryClass: response.data,
                        jDoctorConditions: {}
                    };
                } catch(error) {
                    console.log(error);
                    return {
                        repositoryClass: null,
                        jDoctorConditions: {}
                    };
                }
            }
        },
        getJDoctorCondition: async function (idRepository, idRepositoryClass, idJDoctorCondition)  {
            const repositoryClass = await this.getRepositoryClass(idRepository, idRepositoryClass);
            const jDoctorConditions = repositoryClass.jDoctorConditions;
            if (idJDoctorCondition in jDoctorConditions) {
                return jDoctorConditions[idJDoctorCondition];
            } else {
                try {
                    console.log(idRepository, idRepositoryClass, idJDoctorCondition);
                    const response = await axios.get(api.getJDoctorConditionUrl(idRepository, idRepositoryClass, idJDoctorCondition));
                    console.log("cache di merda");
                    console.log(response.data);
                    return response.data;
                } catch(error) {
                    console.log(error);
                    return null;
                }
            }
        }
    });
    const [currentRepository, setCurrentRepository] = useState(null);
    const [currentRepositoryClass, setCurrentRepositoryClass] = useState(null);
    const [currentJDoctorCondition, setCurrentJDoctorCondition] = useState( null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(  () => {
        console.log("useEffect []");
          axios
            .get(api.getAllrepositoriesUrl())
            .then(async (response) => {
                if (response.data.length > 0) {
                    const repository = response.data[0];
                    setCurrentRepository({
                        repository: repository,
                        repositoryClasses: {}
                    });
                    const repositoriesCacheDict = response.data.reduce((acc, r) => {
                        return { ...acc,
                            [`${r._id}`]: {
                                repository: r,
                                repositoryClasses: {},
                        }}
                    }, {});
                    setCache((prevState) => {
                        return {
                            ...prevState,
                            repositories: repositoriesCacheDict
                        }
                    });
                } else {
                    setCurrentRepository(null);
                }
            })
            .catch((error) => {
                console.log(error);
                setCurrentRepository(null);
            })
    }, []);

    useEffect( () => {
        console.log("useEffect [currentRepository]");
        console.log(currentRepository);
        console.log(cache);
        console.log(currentRepository ? currentRepository.repository.classes : "null");
        console.log(currentRepository ? currentRepository.repository.classes.length > 0: "null");
        if (currentRepository !== null && currentRepository.repository.classes.length > 0) {
            console.log("ENTROOOOO");
            const idRepository = currentRepository.repository._id;
            const idRepositoryClass = currentRepository.repository.classes[0]._id;

            cache
                .getRepositoryClass(idRepository, idRepositoryClass)
                .then((repositoryClass) => {
                    console.log("fdp")
                    console.log(repositoryClass)
                    setCache((prevState) => {
                        return {
                            ...prevState,
                            repositories: {
                                ...prevState.repositories,
                                [idRepository]: {
                                    ...prevState.repositories[idRepository],
                                    repositoryClasses: {
                                        ...prevState.repositories[idRepository].repositoryClasses,
                                        [idRepositoryClass]: repositoryClass
                                    }
                                }
                            }
                        }
                    });
                    setCurrentRepositoryClass(repositoryClass);
                }).catch((error) => {
                        console.log(error);
                });
        } else {
            setCurrentRepositoryClass(null);
        }
    }, [currentRepository]);

    useEffect(() => {
        console.log("useEffect [currentRepositoryClass]");
        console.log(currentRepositoryClass);
        console.log(currentRepositoryClass !== null);
        console.log(currentRepositoryClass !== null ? currentRepositoryClass.repositoryClass.jDoctorConditions : "null")
        console.log(currentRepositoryClass !== null ? currentRepositoryClass.repositoryClass.jDoctorConditions.length : "null")
        console.log(currentRepositoryClass !== null ? currentRepositoryClass.repositoryClass.jDoctorConditions.length > 0 : "null")
        if (currentRepositoryClass !== null && currentRepositoryClass.repositoryClass.jDoctorConditions.length > 0) {
            console.log("ENTROOOOO")
            const idRepository = currentRepository.repository._id;
            const idRepositoryClass = currentRepositoryClass.repositoryClass._id;
            const idJDoctorCondition = currentRepositoryClass.repositoryClass.jDoctorConditions[0]._id;
            console.log(idJDoctorCondition);
            cache
                .getJDoctorCondition(idRepository, idRepositoryClass, idJDoctorCondition)
                .then((jDoctorCondition) => {
                    console.log("JDOCTOR CONDITION")
                    console.log(jDoctorCondition)
                    setCurrentJDoctorCondition(jDoctorCondition);
                    setCache((prevState) => {
                        console.log({
                            ...prevState,
                            repositories: {
                                ...prevState.repositories,
                                [idRepository]: {
                                    ...prevState.repositories[idRepository],
                                    repositoryClasses: {
                                        ...prevState.repositories[idRepository].repositoryClasses,
                                        [idRepositoryClass]: {
                                            repositoryClass: currentRepositoryClass.repositoryClass,
                                            jDoctorConditions: {
                                                ...currentRepositoryClass.jDoctorConditions,
                                                [idJDoctorCondition]: jDoctorCondition
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        return {
                            ...prevState,
                            repositories: {
                                ...prevState.repositories,
                                [idRepository]: {
                                    ...prevState.repositories[idRepository],
                                    repositoryClasses: {
                                        ...prevState.repositories[idRepository].repositoryClasses,
                                        [idRepositoryClass]: {
                                            repositoryClass: currentRepositoryClass.repositoryClass,
                                            jDoctorConditions: {
                                                ...currentRepositoryClass.jDoctorConditions,
                                                [idJDoctorCondition]: jDoctorCondition
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }).catch((error) => {
                        console.log(error);
                });
        } else {
            setCurrentJDoctorCondition(null);
        }
    }, [currentRepositoryClass]);

    console.log("RENDER");
    console.log(cache);
    console.log(currentRepository);
    console.log(currentRepositoryClass);
    console.log(currentJDoctorCondition);

    const changeCurrentRepository = (idRepository) => {
        cache
            .getRepository(idRepository)
            .then((repository) => {
                setCurrentJDoctorCondition(null);
                setCurrentRepositoryClass(null);
                setCurrentRepository(repository);
            })
    }

    const changeCurrentRepositoryClass = (idRepositoryClass) => {
        const idRepository = currentRepository.repository._id;
        cache
            .getRepositoryClass(idRepository, idRepositoryClass)
            .then((repositoryClass) => {
                console.log(repositoryClass);
                setCurrentJDoctorCondition(null);
                setCurrentRepositoryClass(repositoryClass);
            });
    }

    const changeCurrentJDoctorCondition = (idJDoctorCondition) => {
        const idRepository = currentRepository.repository._id;
        const idRepositoryClass = currentRepositoryClass.repositoryClass._id;
        cache
            .getJDoctorCondition(idRepository, idRepositoryClass, idJDoctorCondition)
            .then((jDoctorCondition) => {
                setCurrentJDoctorCondition(jDoctorCondition);
            })
    }

    const updateCurrentJDoctorCondition = (condition, conditionType, operation) => {
        const idRepository = currentRepository.repository._id;
        const idRepositoryClass = currentRepositoryClass.repositoryClass._id;
        const idJDoctorCondition = currentJDoctorCondition._id;
        let updatedJDoctorCondition = {
            ...currentJDoctorCondition,
            [conditionType]: operation == "add" ?
                [...currentJDoctorCondition[conditionType], condition]
                :
                currentJDoctorCondition[conditionType].filter(id => id != condition._id)
        };
        setCurrentJDoctorCondition(updatedJDoctorCondition);
        setCache((prevState) => {
            return { ...prevState,
                repositories: { ...prevState.repositories,
                    [idRepository]: { ...prevState.repositories[idRepository],
                        repositoryClasses: { ...prevState.repositories[idRepository].repositoryClasses,
                            [idRepositoryClass]: {
                                repositoryClass: prevState.repositories[idRepository].repositoryClasses[idRepositoryClass].repositoryClasses,
                                jDoctorConditions: { ...prevState.repositories[idRepository].repositoryClasses[idRepositoryClass].jDoctorConditions,
                                    [idJDoctorCondition]: updatedJDoctorCondition
        }}}}}}});
    }

    const uploadJDoctorConditions = async (modalObj) => {
        console.log(modalObj);
        const processFiles = (returnState) => {
            const selectedFiles = returnState.files;
            const readFile = (file) => {
                return new Promise((resolve, reject) => {
                    if (file.type === 'application/json' || file.name.endsWith('.json')) {
                        const reader = new FileReader();

                        reader.onload = (e) => {
                            const fileContent = e.target.result;
                            try {
                                const repositoryClass = JSON.parse(fileContent);
                                resolve(repositoryClass);
                            } catch (error) {
                                reject(error);
                            }
                        };
                        reader.readAsText(file);
                    } else {
                        resolve(null); // Skip non-JSON files
                    }
                });
            };

            const readAllFiles = () => {
                const promises = selectedFiles.map((file) => readFile(file));
                return Promise.all(promises);
            };

            return readAllFiles()
                .then((result) => {
                    const repositoryClasses = [];
                    result.forEach((repositoryClass) => {
                        if (repositoryClass !== null) {
                            repositoryClasses.push(repositoryClass);
                        }
                    });
                    return {
                        repository: returnState.repository,
                        repositoryClasses: repositoryClasses,
                    };
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        const uploadToDatabase = async (processedObj) => {
            const repository = processedObj.repository;
            const repositoryClasses = processedObj.repositoryClasses;
            let idRepository = repository._id;
            const uploadedRepositoryClasses = {};
            let cachedRepositoryClasses = [];

            if (idRepository == null) {
                try {
                    const response = await axios.post(api.createRepositoryUrl(), { "repository": { ...repository, classes: [] } })
                    idRepository = response.data._id;
                    repository._id = response.data._id;
                    repository.classes = [];
                    setCache((prevState) => {
                        return { ...prevState,
                            repositories: { ...prevState.repositories,
                                [idRepository]: {
                                    repository: response.data,
                                    repositoryClasses: {}
                    }}}});
                    cachedRepositoryClasses = [];
                } catch (error) {
                    console.log(error);
                    return {
                        repository: null,
                        repositoryClasses: []
                    }
                }
            } else {
                cachedRepositoryClasses = Object.values(repository.classes);
            }

            for(let repositoryClass of repositoryClasses) {
                const filteredRepositoryClasses = cachedRepositoryClasses.filter(c => c.name == repositoryClass.name);
                if (filteredRepositoryClasses.length == 0) {
                    try {
                        console.log("FACCIO UNA POST!")
                        const response = await axios.post(api.createRepositoryClassUrl(repository._id), {"repositoryClass": repositoryClass})
                        repository.classes.push({
                            _id: response.data._id,
                            name: response.data.name
                        });
                        console.log(response.data)
                        uploadedRepositoryClasses[response.data._id] = {
                            repositoryClass: response.data,
                            jDoctorConditions: {}
                        };
                    } catch (error) {
                        console.log(error);
                    }

                } else {
                    console.log("Repository class already exists. Not uploaded.");
                }
            }
            console.log("FACCIO QUELLO CHE VOGLIO");
            console.log(uploadedRepositoryClasses);
            setCache((prevState) => {
                console.log("END");
                console.log({...prevState,
                    repositories: { ...prevState.repositories,
                        [idRepository]: {
                            repository: repository,
                            repositoryClasses: {
                                ...prevState.repositories[idRepository].repositoryClasses,
                                ...uploadedRepositoryClasses
                            }}}});
                return {...prevState,
                    repositories: { ...prevState.repositories,
                        [idRepository]: {
                            repository: repository,
                            repositoryClasses: {
                                ...prevState.repositories[idRepository].repositoryClasses,
                                ...uploadedRepositoryClasses
            }}}}});

            if (currentRepository == null) {
                setCurrentRepository({
                    repository,
                    repositoryClasses: uploadedRepositoryClasses
                });
            } else if (currentRepository.repository._id == idRepository) {
                setCurrentRepository({
                    repository,
                    repositoryClasses: {
                        ...currentRepository.repositoryClasses,
                        ...uploadedRepositoryClasses
                    }
                });
            }
        };

        processFiles(modalObj)
            .then((processedObj) => {
                if (processedObj.repository !== null){
                    uploadToDatabase(processedObj);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const deleteRepository = async (idRepository) => {
        axios
            .delete(api.deleteRepositoryUrl(idRepository))
            .then((response) => {
                console.log("DELETE REPOSITORY");
                console.log(response);
                setCache((prevState) => {
                    const newState = { ...prevState };
                    delete newState.repositories[idRepository];
                    return newState;
                });
                if (currentRepository.repository._id == idRepository) {
                    if (Object.keys(cache.repositories).length > 0) {
                        setCurrentRepository(cache.repositories[Object.keys(cache.repositories)[0]]);
                    }
                    else {
                        setCurrentRepository(null);
                        setCurrentRepositoryClass(null);
                        setCurrentJDoctorCondition(null);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const deleteRepositoryClass = async (idRepositoryClass) => {
        const idRepository = currentRepository.repository._id;
        axios
            .delete(api.deleteRepositoryClassUrl(idRepository, idRepositoryClass))
            .then((response) => {
                console.log(cache);
                console.log(currentRepository);
                const newRepositoryClassesState = currentRepository.repositoryClasses;
                console.log("DELETE REPOSITORY CLASS");
                console.log(newRepositoryClassesState);
                delete newRepositoryClassesState[idRepositoryClass];
                const updatedRepository = {
                    repository: {
                        ...currentRepository.repository,
                        classes: currentRepository.repository.classes.filter(c => c._id !== idRepositoryClass)
                    },
                    repositoryClasses: newRepositoryClassesState
                }
                setCache((prevState) => {
                    return {...prevState,
                        repositories: { ...prevState.repositories,
                            [idRepository]: updatedRepository
                }}});
                if (currentRepositoryClass.repositoryClass._id == idRepositoryClass) {
                    if (Object.keys(newRepositoryClassesState).length > 0) {
                        setCurrentRepositoryClass(Object.values(newRepositoryClassesState)[0]);
                    } else {
                        setCurrentRepositoryClass(null);
                    }
                }
                setCurrentRepository(updatedRepository);
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const deleteJDoctorCondition = async (idJDoctorCondition) => {
        const idRepository = currentRepository.repository._id;
        const idRepositoryClass = currentRepositoryClass.repositoryClass._id;
        axios
            .delete(api.deleteJDoctorConditionUrl(idRepository, idRepositoryClass, idJDoctorCondition))
            .then((response) => {
                const newJDoctorConditionsState = currentRepositoryClass.jDoctorConditions;
                delete newJDoctorConditionsState[idJDoctorCondition];
                const updatedRepositoryClass = {
                    repositoryClass: {
                        ...currentRepositoryClass.repositoryClass,
                        jDoctorConditions: currentRepositoryClass.repositoryClass.jDoctorConditions.filter(j => j._id !== idJDoctorCondition)
                    },
                    jDoctorConditions: newJDoctorConditionsState
                }
                setCache((prevState) => {
                    return {...prevState,
                        repositories: { ...prevState.repositories,
                            [idRepository]: { ...prevState.repositories[idRepository],
                                repositoryClasses: { ...prevState.repositories[idRepository].repositoryClasses,
                                    [idRepositoryClass]: updatedRepositoryClass
                }}}}});

                if (currentRepositoryClass.repositoryClass._id == idRepositoryClass) {
                    setCurrentRepositoryClass(updatedRepositoryClass);
                }

                if (currentJDoctorCondition._id == idJDoctorCondition) {
                    if (Object.keys(newJDoctorConditionsState).length > 0) {
                        setCurrentJDoctorCondition(Object.values(newJDoctorConditionsState)[0]);
                    } else {
                        setCurrentJDoctorCondition(null);
                    }
                } else {
                    setCurrentJDoctorCondition(currentJDoctorCondition);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const exportDB = async () => {
        console.log("exportDB");
        console.log(api.exportDBUrl())
        axios
            .get(api.exportDBUrl() )
            .then((response) => {
                console.log(response);
                saveAs(response.data, 'db.zip');
            }).catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <h1 id="main-title">Data Augmentation</h1>
            <div id="page">
                <div id="menu">
                    <List
                        label="Repositories"
                        identifier="repository"
                        selected={ (() => { console.log(currentRepository); return currentRepository ? currentRepository.repository._id : null })() }
                        elements={ (() => { console.log(currentRepository); return Object.values(cache.repositories).map(r => {
                            return {
                                _id: r.repository._id,
                                name: r.repository.projectName
                            }}
                        )})() }
                        onClickCallback={changeCurrentRepository}
                        deleteButtonCallback={deleteRepository}
                    />
                    <List
                        label="Classes"
                        identifier="repository-classes"
                        selected={ (() => { console.log(currentRepositoryClass); return currentRepositoryClass ? currentRepositoryClass.repositoryClass._id : null })()}
                        elements={ currentRepository !== null && currentRepository.repository.classes.map(c => {
                            const _id = c._id;
                            let name = c.name;
                            name = name.substring(name.lastIndexOf(".") + 1);
                            return {
                                _id: _id,
                                name: name
                            }
                        })}
                        onClickCallback={changeCurrentRepositoryClass}
                        deleteButtonCallback={deleteRepositoryClass}
                    />
                    <List
                        label="JDoctor Conditions"
                        identifier="jdc"
                        selected={ currentJDoctorCondition ? currentJDoctorCondition._id : null }
                        elements={ currentRepositoryClass && Object.values(currentRepositoryClass.repositoryClass.jDoctorConditions).map(j => {
                            const _id = j._id;
                            let name = j.name;
                            return {
                                _id: _id,
                                name: name
                            }
                        }) || []}
                        onClickCallback={ changeCurrentJDoctorCondition }
                        deleteButtonCallback={ deleteJDoctorCondition }
                    />
                </div>
                <div id="main" className={ currentJDoctorCondition != null ? "main" : "main-not-found" }>
                    <Main
                        repository={currentRepository}
                        repositoryClass={currentRepositoryClass}
                        jdc={currentJDoctorCondition}
                        updateCurrentJDC={updateCurrentJDoctorCondition}
                    />
                </div>
                <div className="add-button-set">
                    <CircleMenuButton
                        label="Upload JDoctor Conditions"
                        onClick={() => { setIsModalOpen(true); }}
                    ><FaFileUpload color="white" size={30} /></CircleMenuButton>
                    <CircleMenuButton
                        label="Export JDoctor Conditions"
                        onClick={() => { exportDB(); }}
                    ><MdCloudDownload color="white" size={30} /></CircleMenuButton>
                </div>
            </div>
            <Modal
                open={isModalOpen}
                onClose={()=>{ setIsModalOpen(false); }}
                onConfirm={(modalObj) => { uploadJDoctorConditions(modalObj); }}
                disableProperties={{ repository: (property) => { return property == null; }}}
                modalState={{
                    repository: null,
                    repositoryClasses: []
                }}
                confirmButtonLabel={"Upload"}
            >
                <UploadJDCModalContent
                    repositories={Object.values(cache.repositories).map(r => r.repository)}
                />
            </Modal>
        </>
    )
}

export default App;
