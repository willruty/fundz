package dao

import (
	"fmt"
	"fundz/internal/database"
	model "fundz/internal/model/entity"

	"github.com/google/uuid"
)

// -------
// Create
// -------
func CreateUser(user model.User) error {
	if err := database.DB.Create(&user).Error; err != nil {
		return err
	}
	return nil
}

func GetUserByEmail(email string) (model.User, error) {
	var user model.User

	if err := database.DB.Model(&model.User{}).Where("email = ?", email).First(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}

func GetUserById(id uuid.UUID) (model.User, error) {
	var user model.User

	if err := database.DB.Model(&model.User{}).Where("user_id = ?", id).First(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}

// -------
// Update
// -------
func UpdateUserById(userUpdated model.User, id uuid.UUID) error {

	query := database.DB.Model(&model.User{}).Where("user_id = ?", id).Updates(userUpdated)
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
func DeleteUserById(id string) error {
	var user model.User

	query := database.DB.Where("user_id = ?", id).Delete(user)
	if err := query.Error; err != nil {
		return err
	} else if query.RowsAffected == 0 {
		return fmt.Errorf("registro não encontrado")
	}

	return nil
}
