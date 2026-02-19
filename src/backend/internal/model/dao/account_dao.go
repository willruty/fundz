package dao

import (
	"fmt"
	database "fundz/internal/database"
	model "fundz/internal/model/entity"
)

// -------
// Create
// -------
func CreateAccount(account model.Accounts) error {
	if err := database.DB.Create(&account).Error; err != nil {
		return err
	}
	return nil
}

func GetAllAccounts() ([]model.Accounts, int64, error) {

	var account []model.Accounts
	var count int64

	result := database.DB.Model(&model.Accounts{}).Count(&count).Find(&account)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return account, result.RowsAffected, nil
}

func GetAccountById(pk string) (model.Accounts, error) {
	var account model.Accounts

	if err := database.DB.Where("id = ?", pk).First(&account).Error; err != nil {
		return account, err
	}

	return account, nil
}

// -------
// Update
// -------
func UpdateAccountById(modelUpdated model.Accounts) error {

	query := database.DB.Model(&model.Accounts{}).Where("id = ?", modelUpdated.ID).Updates(modelUpdated)
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
func DeleteAccountById(id string) error {
	var account model.Accounts

	query := database.DB.Where("id = ?", id).Delete(account)
	if err := query.Error; err != nil {
		return err
	} else if query.RowsAffected == 0 {
		return fmt.Errorf("registro não encontrado")
	}

	return nil
}
