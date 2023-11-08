const BASE_URL = "http://localhost:3000"; //"https://tratto-jdc-api.onrender.com";

const api = {
    exportDBUrl: () => `${BASE_URL}/export`,
    getAllrepositoriesUrl: () => `${BASE_URL}/repositories`,
    getWholeRepositoryUrl: (idRepository) => `${BASE_URL}/repositories/${idRepository}/whole`,
    getAllreporitoryClassesUrl: (idRepository) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses`,
    getAllJDoctorConditionsUrl: (idRepository, idRepositoryClass) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses/${idRepositoryClass}/jdoctorconditions`,
    getAllConditionsUrl: (idRepository, idRepositoryClass, idJDoctorCondition, conditionType) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses/${idRepositoryClass}/jdoctorconditions/${idJDoctorCondition}/${conditionType}`,
    getRepositoryClassUrl: (idRepository, idRepositoryClass) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses/${idRepositoryClass}`,
    getJDoctorConditionUrl: (idRepository, idRepositoryClass, idJDoctorCondition) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses/${idRepositoryClass}/jdoctorconditions/${idJDoctorCondition}`,
    createRepositoryUrl: () => `${BASE_URL}/repositories/`,
    createRepositoryClassUrl: (idRepository) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses`,
    createConditionUrl: (idRepository, idRepositoryClass, idJDoctorCondition, conditionType) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses/${idRepositoryClass}/jdoctorconditions/${idJDoctorCondition}/${conditionType}`,
    deleteRepositoryUrl: (idRepository) => `${BASE_URL}/repositories/${idRepository}`,
    deleteRepositoryClassUrl: (idRepository, idRepositoryClass) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses/${idRepositoryClass}`,
    deleteJDoctorConditionUrl: (idRepository, idRepositoryClass, idJDoctorCondition) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses/${idRepositoryClass}/jdoctorconditions/${idJDoctorCondition}`,
    deleteConditionUrl: (idRepository, idRepositoryClass, idJDoctorCondition, idCondition, conditionType) => `${BASE_URL}/repositories/${idRepository}/repositoryClasses/${idRepositoryClass}/jdoctorconditions/${idJDoctorCondition}/${conditionType}/${idCondition}`
}

export default api;