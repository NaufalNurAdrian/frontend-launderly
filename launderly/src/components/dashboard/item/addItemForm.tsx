'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  alpha,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Close as CloseIcon, 
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';
import { Item } from '@/services/itemService';

interface AddItemFormProps {
  onSubmit: (item: Item) => Promise<void>;
  initialData?: Item;
  isEdit?: boolean;
  onCancel?: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEdit = false,
  onCancel 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState<Item>(
    initialData || {
      itemName: ''
    }
  );
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    itemName?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      itemName?: string;
    } = {};
    
    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,  
      [name]: value
    });
    
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
      
      if (!isEdit) {
        setFormData({
          itemName: ''
        });
        // Show success state briefly
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className={`mb-6 rounded-2xl overflow-hidden bg-white shadow-2xl 
        transition-all duration-300 transform hover:-translate-y-1 hover:shadow-3xl`}>
        
        {/* Header with gradient background */}
        <div className={`flex items-center justify-between p-4 
          ${isEdit 
            ? 'bg-gradient-to-r from-blue-700 to-blue-500' 
            : 'bg-gradient-to-r from-blue-600 to-blue-400'} 
          text-white`}>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            {isEdit ? (
              <>
                <EditIcon fontSize="small" />
                Edit Item
              </>
            ) : (
              <>
                <AddIcon fontSize="small" />
                Add New Item
              </>
            )}
          </h2>
          
          {isEdit && onCancel && (
            <button 
              onClick={onCancel}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
            >
              <CloseIcon fontSize="small" />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-5 mt-2">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              placeholder="Enter item name"
              value={formData.itemName}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full p-3.5 text-base rounded-xl border-2 transition 
                focus:ring-2 focus:outline-none font-medium
                ${errors.itemName 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200 hover:border-blue-400'}`}
            />
            {errors.itemName && (
              <p className="mt-1 text-sm text-red-600">{errors.itemName}</p>
            )}
          </div>
          
          <div className={`flex gap-3 justify-end ${isMobile ? 'flex-col' : ''}`}>
            {isEdit && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-1.5 px-6 py-3 
                  rounded-xl border-2 border-gray-300 text-gray-700 font-semibold
                  hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50
                  ${isMobile ? 'md:flex-initial' : ''}`}
              >
                <CloseIcon fontSize="small" />
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || success}
              className={`flex-1 flex items-center justify-center gap-1.5 px-6 py-3 
                rounded-xl font-semibold shadow-lg transition-all
                hover:-translate-y-0.5 hover:shadow-xl
                disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg
                ${isMobile ? 'md:flex-initial' : ''}
                ${isEdit 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : success 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : success ? (
                <>
                  <CheckCircleIcon fontSize="small" />
                  Saved Successfully!
                </>
              ) : (
                isEdit ? 'Update Item' : 'Create Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;