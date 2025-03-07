'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import itemService, { getItem, Item } from '@/services/itemService';
import { LaundryItem } from '@/types/laundryItem.type';
import AddItemForm from '@/components/dashboard/item/addItemForm';
import ItemList from '@/components/dashboard/item/itemList';
import DeleteConfirmDialog from '@/components/dashboard/item/deleteConfirmationDialog';
import { withSuperAdmin } from '@/hoc/adminAuthorizaton';
import { useRole } from '@/hooks/useRole';

function ItemManagementPage() {
  const [items, setItems] = useState<LaundryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const role = useRole();
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    itemId: '',
    itemName: ''
  });
  useEffect(() => {
    fetchItems();
  }, []);
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItem();
      setItems(response.getitem || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      showAlert('Failed to load items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (item: Item) => {
    try {
      await itemService.createItem(item);
      showAlert('Item created successfully!', 'success');
      fetchItems();
    } catch (error: any) {
      showAlert(error.response?.data?.message || 'Failed to create item', 'error');
      throw error;
    }
  };

  const handleUpdateItem = async (item: Item) => {
    try {
      await itemService.updateItem(item);
      showAlert('Item updated successfully!', 'success');
      fetchItems();
      setEditMode(false);
      setCurrentItem(null);
    } catch (error: any) {
      showAlert(error.response?.data?.message || 'Failed to update item', 'error');
      throw error;
    }
  };

  const handleEdit = (item: Item) => {
    setCurrentItem(item);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentItem(null);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({
      open: true,
      itemId: id,
      itemName: name
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await itemService.deleteItem(deleteDialog.itemId);
      showAlert('Item deleted successfully!', 'success');
      fetchItems();
    } catch (error) {
      showAlert('Failed to delete item', 'error');
    } finally {
      setDeleteDialog({
        open: false,
        itemId: '',
        itemName: ''
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({
      open: false,
      itemId: '',
      itemName: ''
    });
  };

  const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false
    });
  };

  const mapLaundryItemsToItems = (laundryItems: LaundryItem[]): Item[] => {
    return laundryItems.map(item => ({
      id: item.id.toString(),
      itemName: item.itemName,
      qty: item.qty,
      isDelete: item.isDelete,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
  };

  if (role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Laundry Item Management
        </Typography>
        
        {editMode ? (
          <AddItemForm 
            initialData={currentItem!}
            isEdit={true}
            onSubmit={handleUpdateItem}
            onCancel={handleCancelEdit}
          />
        ) : (
          <AddItemForm 
            onSubmit={handleCreateItem}
          />
        )}
        
        {loading && items.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <ItemList 
              items={mapLaundryItemsToItems(items)}
              loading={loading && items.length > 0}
              onEdit={handleEdit}
              onDelete={(id) => {
                const item = items.find(item => item.id.toString() === id);
                if (item) {
                  handleDeleteClick(id, item.itemName);
                }
              }}
            />
          </Box>
        )}
      </Box>
      <DeleteConfirmDialog
        open={deleteDialog.open}
        itemName={deleteDialog.itemName}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        onClose={handleCancelDelete}
      />
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default withSuperAdmin(ItemManagementPage)