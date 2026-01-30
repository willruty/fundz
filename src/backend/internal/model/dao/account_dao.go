package dao

import (
	"fmt"
	database "fundz/internal/database"
	model "fundz/internal/model/entity"
)

// -------
// Create
// -------
func CreateAccount(account model.Account) error {
	if err := database.DB.Create(&account).Error; err != nil {
		return err
	}
	return nil
}

func GetAllAccount() ([]model.Account, int64, error) {

	var account []model.Account
	var count int64

	result := database.DB.Model(&model.Account{}).Count(&count).Find(&account)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return account, result.RowsAffected, nil
}

func GetAccountById(pk string) (model.Account, error) {
	var account model.Account

	if err := database.DB.Where("act_id = ?", pk).First(&account).Error; err != nil {
		return account, err
	}

	return account, nil
}

// -------
// Update
// -------
func UpdateAccountById(modelUpdated model.Account, id string) error {

	query := database.DB.Model(&model.Account{}).Where("act_id = ?", id).Updates(modelUpdated)
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
	var account model.Account

	query := database.DB.Where("act_id = ?", id).Delete(account)
	if err := query.Error; err != nil {
		return err
	} else if query.RowsAffected == 0 {
		return fmt.Errorf("registro não encontrado")
	}

	return nil
}
