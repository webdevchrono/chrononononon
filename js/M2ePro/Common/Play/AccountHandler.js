CommonPlayAccountHandler = Class.create();
CommonPlayAccountHandler.prototype = Object.extend(new CommonHandler(), {

    //----------------------------------

    initialize: function()
    {
        this.setValidationCheckRepetitionValue('M2ePro-account-title',
                                                M2ePro.translator.translate('The specified title is already used for other account. Account title must be unique.'),
                                                'Account', 'title', 'id',
                                                M2ePro.formData.id,
                                                M2ePro.php.constant('Ess_M2ePro_Helper_Component_Play::NICK'));

        Validation.add('M2ePro-require-select-attribute', M2ePro.translator.translate('You must enable marketplace first.'), function(value, el) {

            if ($('other_listings_mapping_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_MODE_NO')) {
                return true;
            }

            var isAttributeSelected = false;

            $$('.attribute-mode-select').each(function(obj) {
                if (obj.value != 0) {
                    isAttributeSelected = true;
                }
            });

            return isAttributeSelected;
        });

        Validation.add('M2ePro-access', M2ePro.translator.translate('M2E Pro was not able to get access to the Play.com account. Please, make sure, that you enter correct Play.com login and password. If everything is correct but you still unable to access your account, please contact Play.com Customer Service Department on 0845 800 1020 (UK only) or +44 (0)1534 877595 (outside UK).'), function(value, el){

            var checkResult = false,
                login = $('login').value,
                password = $('password').value,
                panel_mode = $('panel_mode').value;

            if (password == '') {
                return true;
            }

            new Ajax.Request( M2ePro.url.get('adminhtml_common_play_account/checkAuth') ,
                {
                    method: 'post',
                    asynchronous : false,
                    parameters : {
                        login : login,
                        password : password,
                        panel_mode : panel_mode
                    },
                    onSuccess: function (transport)
                    {
                        checkResult = transport.responseText.evalJSON()['result'];
                    }
                });

            return checkResult;
        });

        Validation.add('M2ePro-marketplace-disabled', M2ePro.translator.translate('You must enable marketplace first.'), function(value, el) {
            return false;
        });
    },

    //----------------------------------

    completeStep: function()
    {
        window.opener.completeStep = 1;
        window.close();
    },

    //----------------------------------

    delete_click: function()
    {
        if (!confirm(M2ePro.translator.translate('Be attentive! By deleting account you delete all information on it from M2E Pro server. This will cause inappropriate work of all accounts\' copies.'))) {
            return;
        }
        setLocation(M2ePro.url.get('deleteAction'));
    },

    //----------------------------------

    update_password: function()
    {
        $('password_button').hide();
        $('password_input').show();
        $('password_required').show();
    },

    //----------------------------------

    other_listings_synchronization_change : function()
    {
        if (this.value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_SYNCHRONIZATION_YES')) {
            $('other_listings_mapping_mode_tr').show();
            $('related_store_id_container').show();
        } else {
            $('other_listings_mapping_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_MODE_NO');
            $('other_listings_mapping_mode').simulate('change');
            $('other_listings_mapping_mode_tr').hide();
            $('related_store_id_container').hide();
        }
    },

    other_listings_mapping_mode_change : function()
    {
        if (this.value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_MODE_YES')) {
            $('magento_block_play_accounts_other_listings_product_mapping').show();
            $('magento_block_play_accounts_other_listings_move_mode').show();
        } else {
            $('magento_block_play_accounts_other_listings_product_mapping').hide();
            $('magento_block_play_accounts_other_listings_move_mode').hide();

            $('other_listings_move_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MOVE_TO_LISTINGS_DISABLED');
            $('mapping_general_id_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_GENERAL_ID_MODE_NONE');
            $('mapping_sku_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_SKU_MODE_NONE');
            $('mapping_title_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_TITLE_MODE_NONE');
        }

        $('mapping_general_id_mode').simulate('change');
        $('mapping_sku_mode').simulate('change');
        $('mapping_title_mode').simulate('change');

        $('other_listings_move_mode').simulate('change');
    },

    //----------------------------------

    mapping_general_id_mode_change : function()
    {
        if (this.value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_GENERAL_ID_MODE_NONE')) {
            $('mapping_general_id_priority_td').hide();
            $('mapping_general_id_attribute_tr').hide();
        } else {
            $('mapping_general_id_priority_td').show();
            $('mapping_general_id_attribute_tr').show();
        }
    },

    mapping_sku_mode_change : function()
    {
        if (this.value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_SKU_MODE_NONE')) {
            $('mapping_sku_priority_td').hide();
            $('mapping_sku_attribute_tr').hide();
        } else {
            $('mapping_sku_priority_td').show();

            if (this.value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_SKU_MODE_CUSTOM_ATTRIBUTE')) {
                $('mapping_sku_attribute_tr').show();
            } else {
                $('mapping_sku_attribute_tr').hide();
            }
        }
    },

    mapping_title_mode_change : function()
    {
        if (this.value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_TITLE_MODE_NONE')) {
            $('mapping_title_priority_td').hide();
            $('mapping_title_attribute_tr').hide();
        } else {
            $('mapping_title_priority_td').show();

            if (this.value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MAPPING_TITLE_MODE_CUSTOM_ATTRIBUTE')) {
                $('mapping_title_attribute_tr').show();
            } else {
                $('mapping_title_attribute_tr').hide();
            }
        }
    },

    //----------------------------------

    move_mode_change : function()
    {
        if ($('other_listings_move_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::OTHER_LISTINGS_MOVE_TO_LISTINGS_ENABLED')) {
            $('other_listings_move_synch_tr').show();
        } else {
            $('other_listings_move_synch_tr').hide();
        }
    },

    //----------------------------------

    ordersModeChange : function()
    {
        var self = PlayAccountHandlerObj;

        if ($('orders_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::ORDERS_MODE_YES')) {
            $('magento_block_play_accounts_magento_orders_listings').show();
            $('magento_block_play_accounts_magento_orders_listings_other').show();
        } else {
            $('magento_block_play_accounts_magento_orders_listings').hide();
            $('magento_block_play_accounts_magento_orders_listings_other').hide();
        }

        $('magento_orders_listings_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_MODE_NO');
        $('magento_orders_listings_other_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_OTHER_MODE_NO');

        self.magentoOrdersListingsModeChange();
        self.magentoOrdersListingsOtherModeChange();
    },

    magentoOrdersListingsModeChange : function()
    {
        var self = PlayAccountHandlerObj;

        if ($('magento_orders_listings_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_MODE_YES')) {
            $('magento_orders_listings_store_mode_container').show();
        } else {
            $('magento_orders_listings_store_mode_container').hide();
        }

        $('magento_orders_listings_store_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_STORE_MODE_DEFAULT');
        self.magentoOrdersListingsStoreModeChange();

        self.changeVisibilityForOrdersModesRelatedBlocks();
    },

    magentoOrdersListingsStoreModeChange : function()
    {
        if ($('magento_orders_listings_store_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_STORE_MODE_CUSTOM')) {
            $('magento_orders_listings_store_id_container').show();
        } else {
            $('magento_orders_listings_store_id_container').hide();
        }

        $('magento_orders_listings_store_id').value = '';
    },

    magentoOrdersListingsOtherModeChange : function()
    {
        var self = PlayAccountHandlerObj;

        if ($('magento_orders_listings_other_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_OTHER_MODE_YES')) {
            $('magento_orders_listings_other_product_mode_container').show();
            $('magento_orders_listings_other_store_id_container').show();
        } else {
            $('magento_orders_listings_other_product_mode_container').hide();
            $('magento_orders_listings_other_store_id_container').hide();
        }

        $('magento_orders_listings_other_product_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_OTHER_PRODUCT_MODE_IGNORE');
        $('magento_orders_listings_other_store_id').value = '';

        self.magentoOrdersListingsOtherProductModeChange();
        self.changeVisibilityForOrdersModesRelatedBlocks();
    },

    magentoOrdersListingsOtherProductModeChange : function()
    {
        if ($('magento_orders_listings_other_product_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_OTHER_PRODUCT_MODE_IGNORE')) {
            $('magento_orders_listings_other_product_mode_note').hide();
            $('magento_orders_listings_other_product_tax_class_id_container').hide();
        } else {
            $('magento_orders_listings_other_product_mode_note').show();
            $('magento_orders_listings_other_product_tax_class_id_container').show();
        }
    },

    magentoOrdersCustomerModeChange : function()
    {
        var customerMode = $('magento_orders_customer_mode').value;

        if (customerMode == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_CUSTOMER_MODE_PREDEFINED')) {
            $('magento_orders_customer_id_container').show();
            $('magento_orders_customer_id').addClassName('M2ePro-account-product-id');
        } else {  // M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::ORDERS_CUSTOMER_MODE_GUEST') || M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::ORDERS_CUSTOMER_MODE_NEW')
            $('magento_orders_customer_id_container').hide();
            $('magento_orders_customer_id').removeClassName('M2ePro-account-product-id');
        }

        var action = (customerMode == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_CUSTOMER_MODE_NEW')) ? 'show' : 'hide';
        $('magento_orders_customer_new_website_id_container')[action]();
        $('magento_orders_customer_new_group_id_container')[action]();
        $('magento_orders_customer_new_notifications_container')[action]();

        $('magento_orders_customer_id').value = '';
        $('magento_orders_customer_new_website_id').value = '';
        $('magento_orders_customer_new_group_id').value = '';
    },

    magentoOrdersStatusMappingModeChange : function()
    {
        // Reset dropdown selected values to default
        $('magento_orders_status_mapping_processing').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_STATUS_MAPPING_PROCESSING');
        $('magento_orders_status_mapping_shipped').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_STATUS_MAPPING_SHIPPED');

        // Default auto create invoice & shipment
        $('magento_orders_invoice_mode').checked = true;
        $('magento_orders_shipment_mode').checked = true;

        var disabled = $('magento_orders_status_mapping_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_STATUS_MAPPING_MODE_DEFAULT');
        $('magento_orders_status_mapping_processing').disabled = disabled;
        $('magento_orders_invoice_mode').disabled = disabled;
        $('magento_orders_status_mapping_shipped').disabled = disabled;
        $('magento_orders_shipment_mode').disabled = disabled;
    },

    changeVisibilityForOrdersModesRelatedBlocks : function()
    {
        var self = PlayAccountHandlerObj;

        if ($('magento_orders_listings_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_MODE_NO') &&
            $('magento_orders_listings_other_mode').value == M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_LISTINGS_OTHER_MODE_NO')) {

            $('magento_block_play_accounts_magento_orders_customer').hide();
            $('magento_orders_customer_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_CUSTOMER_MODE_GUEST');
            self.magentoOrdersCustomerModeChange();

            $('magento_block_play_accounts_magento_orders_status_mapping').hide();
            $('magento_orders_status_mapping_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_STATUS_MAPPING_MODE_DEFAULT');
            self.magentoOrdersStatusMappingModeChange();

            $('magento_block_play_accounts_magento_orders_rules').hide();
            $('magento_orders_qty_reservation_days').value = 0;

            $('magento_block_play_accounts_magento_orders_tax').hide();
            $('magento_orders_tax_mode').value = M2ePro.php.constant('Ess_M2ePro_Model_Play_Account::MAGENTO_ORDERS_TAX_MODE_MIXED');
        } else {
            $('magento_block_play_accounts_magento_orders_customer').show();
            $('magento_block_play_accounts_magento_orders_status_mapping').show();
            $('magento_block_play_accounts_magento_orders_rules').show();
            $('magento_block_play_accounts_magento_orders_tax').show();
        }
    }

    //----------------------------------
});
