import pools from '../database.js';
import { SQL_QUERIES  } from './tower.query.js';



export const purchaseTower = async (UserId, towerId) => {
    const connection = await pools.USER_DB.getConnection();

    let towerPrice;
    let userGold;

    try {
        // 가격 조회
    try {
        const [towerRows] = await connection.query(SQL_QUERIES.GET_TOWER_PRICE, [towerId] );
        if (towerRows.length === 0) throw new Error ('Tower Not found');
         towerPrice = towerRows[0].price;
    } catch (error) {
        console.error('Error fetching tower price', error);
        return {success: false, message: 'Error fetching tower price'};
    }

    try {
        const [userRows] = await connection.query(SQL_QUERIES.GET_USER_GOLD, [userId]);
        if (userRows.length === 0) throw new Error ('User Not Found');
        userGold = userRows[0].gold;
    } catch (error) {
        console.error('error fetching user gold: ', error);
        return {success: false, message: 'Error Fetching User Gold'};
    }
    // 구매 가능 여부
    if (userGold < towerPrice) {
        return {success:false, message: 'Not Enough Gold To Purchase The Tower'};
    }

    try {
        await connection.beginTransaction();

        // 골드 차감
        try {
            await connection.query(SQL_QUERIES.UPDATE_USER_GOLD, [towerPrice, userId]);
        }   catch (error) {
            console.error('Error Update User Gold:', error);
            throw error;
        }

       // 소유 갯수
       try {
        await connection.query(SQL_QUERIES.INSERT_USER_TOWER, [userId, towerId]);
        } catch(error) {
            console.error('Error Inserting User Tower:', error);
            throw error;
        }

        await connection.commit();
        return {success: true, message: 'Tower Purchased Succesdsfully'};
    } catch (error) {
        await connection.rollback();
        return {success: false, message: 'Error During Transaction'};
    }

}finally {
        connection.release();
    }
};
    
