import axios from 'axios';
import Constants from '../utils/Constants'
const API = axios.create({ baseURL: Constants.LOCAL_BACKEND_URL });

export const registerUser = (userData) => API.post('/users/', userData);//--
export const login = (EmailId) => API.get(`/users/${EmailId}`);
export const getAllUsers = () => API.get('/users');//--

export const addFiles = (fileData) => API.post('/files/multiple-file-upload', fileData, {
				headers: {
					'accept': 'application/json',
					'Accept-Language': 'en-US,en;q=0.8',
					'Content-Type': `multipart/form-data; boundary=${fileData._boundary}`,
				}});//--
export const getFilesByUserId = (UserId) => API.get(`/files/${UserId}`);//--
export const updateFile = (FileId,FileData) => API.put(`/files/${FileId}`, FileData);//--
export const getFilesSharedByEmailId = (EmailId) => API.get(`/files/shared/${EmailId}`);//--
export const deleteFileById = (FileId) =>API.delete(`/files/${FileId}`);//--