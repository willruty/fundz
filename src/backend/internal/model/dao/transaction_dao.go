package dao

import (
	"fmt"
	database "fundz/internal/database"
	model "fundz/internal/model/entity"

	"github.com/google/uuid"
)

// -------
// Create
// -------
func CreateTransaction(transaction model.Transaction) error {
	if err := database.DB.Create(&transaction).Error; err != nil {
		return err
	}
	return nil
}

func GetAllTransaction() ([]model.Transaction, int64, error) {

	var transaction []model.Transaction
	var count int64

	result := database.DB.Model(&model.Transaction{}).Count(&count).Find(&transaction)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return transaction, result.RowsAffected, nil
}

func GetTransactionById(pk string) (model.Transaction, error) {
	var transaction model.Transaction

	if err := database.DB.Where("transaction_id = ?", pk).First(&transaction).Error; err != nil {
		return transaction, err
	}

	return transaction, nil
}

// -------
// Update
// -------
func UpdateTransactionById(modelUpdated model.Transaction, id uuid.UUID) error {

	query := database.DB.Model(&model.Transaction{}).Where("transaction_id = ?", id).Updates(modelUpdated)
	if err := query.Error; err != nil {
		return err
	} else if query.RowsAffected == 0 {
		return fmt.Errorf("registro não encontrado")
	}

	return nil
}

// -------
// Delete
// -------
func DeleteTransactionById(id string) error {
	var transaction model.Transaction

	query := database.DB.Where("transaction_id = ?", id).Delete(transaction)
	if err := query.Error; err != nil {
		return err
	} else if query.RowsAffected == 0 {
		return fmt.Errorf("registro não encontrado")
	}

	return nil
}
