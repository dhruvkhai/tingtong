import axios from 'axios';

const API_URL = 'YOUR_COLLEGE_API_BASE_URL'; // Replace with your college's API URL

export interface StudentValidationData {
  enrollmentNo: string;
  email: string;
  mobileNo: string;
}

export interface ValidationResponse {
  isValid: boolean;
  message: string;
  studentData?: {
    name: string;
    course: string;
    batch: string;
    department: string;
  };
}

export const studentService = {
  async validateStudent(data: StudentValidationData): Promise<ValidationResponse> {
    try {
      const response = await axios.post(`${API_URL}/validate-student`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          isValid: false,
          message: error.response?.data?.message || 'Failed to validate student data',
        };
      }
      return {
        isValid: false,
        message: 'An unexpected error occurred',
      };
    }
  },

  async registerStudent(data: StudentValidationData & { password: string }): Promise<ValidationResponse> {
    try {
      const response = await axios.post(`${API_URL}/register-student`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          isValid: false,
          message: error.response?.data?.message || 'Failed to register student',
        };
      }
      return {
        isValid: false,
        message: 'An unexpected error occurred',
      };
    }
  },
}; 